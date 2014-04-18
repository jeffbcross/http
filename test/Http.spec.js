import {$Http, fullUrl} from '../src/Http';
import {$Connection} from '../src/XHRConnection';
import {$RequestData} from '../src/RequestData';
import {$QueryParams} from '../src/QueryParams';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {Injector} from 'di/injector';
import {inject, use} from 'di/testing';
import {ConnectionMock, ConnectionMockFactory} from './mocks/ConnectionMock';


describe('$Http', function () {
  describe('constructor', function() {
    it('should add the Connection class to the service', inject(
        $Http,
        function($http) {
          assert.type($http.ConnectionClass, IConnection);
        }));
  });


  describe('.request()', function() {
    beforeEach(function() {
      this.openSpy = spyOn($Connection.prototype, 'open');
      this.sendSpy = spyOn($Connection.prototype, 'send');
    });


    it('should complain if method is not a string', function() {
      inject($Http, function($http) {
        expect(function() {
          $http.request(undefined, '/users')
        }).toThrow();
        expect(function() {
          $http.request('GET', '/users')
        }).not.toThrow();
      });
    });


    it('should complain if url is not a string', function() {
      inject($Http, function($http) {
        expect(function() {
          $http.request('GET', undefined);
        }).toThrow();
        expect(function() {
          $http.request('GET', '/users')
        }).not.toThrow();
      });
    });


    it('should serialize data before calling open', function() {
      var self = this;
      inject($Http, function($http) {
        $http.request('GET', '/users', {data: {interests: 'JavaScript'}});
        expect(self.sendSpy.calls.all()[0].args[0]).toBe('{"interests":"JavaScript"}');
      });
    });


    it('should create a new Connection', function(){
      inject($Http, function($http) {
        expect($http.request('GET', '/users')).toBeInstanceOf($Connection);
      });
    });


    it('should use ConnectionClass to instantiate a Connection', function() {
      use(ConnectionMockFactory);
      inject($Http, function($http) {
        expect($http.ConnectionClass).toBe(ConnectionMock);
        var connection = $http.request('GET', '/users');
        expect(connection).toBeInstanceOf(ConnectionMock);
      });
    });


    it('should call open on the connection', function() {
      var self = this;
      inject($Http, function($http) {
        $http.request('GET', '/users');
        expect(self.openSpy).toHaveBeenCalledWith('GET', '/users');
      });
    });


    it('should call send on the connection', function() {
      var self = this;
      inject($Http, function($http) {
        $http.request('GET', '/users');
        expect(self.sendSpy).toHaveBeenCalled();
      });
    });


    it('should pass data to send', function() {
      var self = this;
      inject($Http, function($http) {
        var data = '{"user" : "jeffbcross"}';
        $http.request('GET', '/users', {data: data});
        expect(self.sendSpy).toHaveBeenCalledWith(data);
      });
    });
  });


  //TODO (jeffbcross): this is a badly-placed test, does not belong in unit
  //It's also bad because it relies on loading a Karma script
  //This test is merely a guide to make sure I don't lose my way
  xit('should actually execute the request', function(done) {
    inject($Http, function($http) {
      $http.request('GET', '/base/node_modules/pipe/node_modules/karma-requirejs/lib/adapter.js').
      then(function(res) {
        expect(res).toContain('monkey patch');
        done();
      }, function(reason){
        throw new Error(reason);
      });
    });
  });
});


describe('fullUrl()', function() {
  it('should serialize query parameters and add to url', function() {
    var params = new $QueryParams({name: 'Jeff'});
    expect(fullUrl('/users', params)).toBe('/users?name=Jeff');
  });


  it('should append query parameters if parameters already exist', function() {
    var params = new $QueryParams({name: 'Jeff'});
    expect(fullUrl('/users?hair=brown', params)).toBe('/users?hair=brown&name=Jeff');
  });
});
