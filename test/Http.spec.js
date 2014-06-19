import {Http, fullUrl} from '../src/Http';
import {XHRConnection} from '../src/XHRConnection';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {Injector} from 'di/injector';
import {inject, use} from 'di/testing';
import {ConnectionMock, ConnectionMockBackend, ConnectionMockFactory} from './mocks/ConnectionMock';

describe('Http', function() {
  var http, defaultConfig;

  beforeEach(inject(Http, function(_http_) {
    defaultConfig = {method: 'GET', url: '/users'};
    http = _http_;
  }));

  describe('constructor', function() {
    it('should be injectable', inject(Http, function(http) {
      assert.type(http.request, Function);
    }));


    it('should create a defaultInterceptors object', function() {
      expect(http.globalInterceptors).toEqual({
        request: [],
        requestError: [],
        response: [],
        responseError: []
      })
    });
  });


  describe('request()', function() {
    beforeEach(function() {
      this.openSpy = spyOn(XHRConnection.prototype, 'open');
      this.sendSpy = spyOn(XHRConnection.prototype, 'send');
    });


    it('should complain if method is not a string', function() {
      expect(function() {
        http.request({method: undefined, url: '/users'});
      }).toThrow();
      expect(function() {
        http.request(defaultConfig);
      }).not.toThrow();
    });


    it('should complain if url is not a string', function() {
      expect(function() {
        http.request({method: 'GET', url: undefined});
      }).toThrow();
      expect(function() {
        http.request(defaultConfig);
      }).not.toThrow();
    });


    it('should serialize data before calling open', function() {
      http.request({method: 'GET', url: '/users', data: {interests: 'JavaScript'}});
      expect(this.sendSpy.calls.all()[0].args[0]).toBe('{"interests":"JavaScript"}');
    });


    it('should create a new Connection from XHRConnection if no ConnectionClass provided',
        function(){
          expect(http.request(defaultConfig).connection).toBeInstanceOf(XHRConnection);
        });


    it('should use provided ConnectionClass to instantiate a Connection', function() {
      var request = http.request({method: 'GET', url: '/users',
        ConnectionClass: ConnectionMock
      });
      expect(request.connection).toBeInstanceOf(ConnectionMock);
    });


    it('should return a promise', function() {
      assert.type(http.request(defaultConfig).then, Function);
    });


    it('should call open on the connection', function() {
      http.request(defaultConfig);
      expect(this.openSpy).toHaveBeenCalledWith('GET', '/users');
    });


    it('should call send on the connection', function() {
      http.request(defaultConfig);
      expect(this.sendSpy).toHaveBeenCalled();
    });


    it('should pass data to send', function() {
      var data = '{"user" : "jeffbcross"}';
      http.request({method: 'GET', url: '/users', data: data});
      expect(this.sendSpy).toHaveBeenCalledWith(data);
    });


    it('should send the request through the request interceptor', function() {
      var spy = jasmine.createSpy('interceptor');
      spy.and.returnValue({headers:{}});
      http.globalInterceptors.request.push(spy);
      http.request(defaultConfig);
      expect(spy).toHaveBeenCalled();
    });


    it('should apply request headers set in the interceptor', function() {
      var headerSpy = spyOn(XHRConnection.prototype, 'setRequestHeader');
      function interceptor(request) {
        request.headers['Client'] = 'Browser';
        return request;
      }
      http.globalInterceptors.request.push(interceptor);
      http.request(defaultConfig);
      expect(headerSpy).toHaveBeenCalledWith('Client', 'Browser');
    });


    it('should call _processRequest with the Request object', function() {
      var spy = spyOn(http, '_processRequest').and.callThrough();
      http.request({method: 'GET', url: '/something'});
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0].method).toBe('GET');
      expect(spy.calls.argsFor(0)[0].url).toBe('/something');
    });


    it('should call _processResponse with the raw response upon successful request', function() {
      ConnectionMockBackend.forkZone().run(function() {
        var spy = spyOn(http, '_processResponse');
        ConnectionMockBackend.whenRequest('GET', '/users').respond(200, 'rawbody');
        http.request({
          method: 'GET',
          url: '/users',
          ConnectionClass: ConnectionMock
        }).then(spy);
        ConnectionMockBackend.flush();
        expect(spy).toHaveBeenCalled();
      });
    });


    it('should call _processResponseError with the raw response upon successful request', function() {
      ConnectionMockBackend.forkZone().run(function() {
        var spy = spyOn(http, '_processResponseError');
        ConnectionMockBackend.whenRequest('GET', '/users').respond(404, 'error: not found');
        http.request({
          method: 'GET',
          url: '/users',
          ConnectionClass: ConnectionMock
        });
        ConnectionMockBackend.flush();
        expect(spy).toHaveBeenCalled();
      });
    });


    //TODO (jeffbcross): this is a badly-placed test, does not belong in unit
    //It's also bad because it relies on loading a Karma script
    //This test is merely a guide to make sure I don't lose my way
    xit('should actually execute the request', function(done) {
      http.request('GET', '/base/node_modules/pipe/node_modules/karma-requirejs/lib/adapter.js').
      then(function(res) {
        expect(res).toContain('monkey patch');
        done();
      }, function(reason){
        throw new Error(reason);
      });
    });
  });


  describe('._processResponse()', function() {
    it('should process the response through globalInterceptors', function() {
      http.globalInterceptors.response.push(function(response) {
        response.body = response.body.replace('raw','intercepted');
        return response;
      });
      expect(http._processResponse({
        body: 'rawbody',
        responseType: 'text',
        responseText: 'rawbody',
        status: 200,
        headers: new Map(),
      }).body).toBe('interceptedbody');
    });
  });
});


describe('fullUrl()', function() {
  it('should serialize query parameters and add to url', function() {
    var params = {name: 'Jeff'};
    expect(fullUrl('/users', params)).toBe('/users?name=Jeff');
  });


  it('should append query parameters if parameters already exist', function() {
    var params = {name: 'Jeff'};
    expect(fullUrl('/users?hair=brown', params)).toBe('/users?hair=brown&name=Jeff');
  });
});
