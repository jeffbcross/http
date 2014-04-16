import {$Http} from '../src/Http';
import {$XHRConnection} from '../src/XHRConnection';
import {$RequestData} from '../src/RequestData';
import {$QueryParams} from '../src/QueryParams';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {Injector} from 'di/injector';
import {inject, use} from 'di/testing';
import {MockConnection, MockConnectionFactory} from './mocks/MockConnection';


describe('Http', function () {
  describe('constructor', function() {
    it('should add the Connection class to the service', inject(
        $Http,
        function($http) {
          assert.type($http.ConnectionClass, IConnection);
        }));
  });


  describe('.request()', function() {
    beforeEach(function() {
      this.openSpy = spyOn($XHRConnection.prototype, 'open');
      this.sendSpy = spyOn($XHRConnection.prototype, 'send');
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


    it('should call fullUrl before calling open', function() {
      var url, params;
      inject($Http, function($http) {
        spyOn($http, 'fullUrl').and.callFake(function(u, p) {
          url = u;
          params = p;
        });
        $http.request('GET', '/users', {params: {name: 'Jeff'}});
        expect(url).toBe('/users');
        expect(params.toQueryString()).toBe('?name=Jeff');
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
        expect($http.request('GET', '/users')).toBeInstanceOf($XHRConnection);
      });
    });


    it('should use ConnectionClass to instantiate a Connection', function() {
      use(MockConnectionFactory);
      inject($Http, function($http) {
        expect($http.ConnectionClass).toBe(MockConnection);
        var connection = $http.request('GET', '/users');
        expect(connection).toBeInstanceOf(MockConnection);
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


  describe('.fullUrl', function() {
    it('should serialize query parameters and add to url', function() {
      inject($Http, function($http) {
        var params = new $QueryParams({name: 'Jeff'});
        expect($http.fullUrl('/users', params)).toBe('/users?name=Jeff');
      });
    });


    it('should append query parameters if parameters already exist', function() {
      var self = this;
      inject($Http, function($http) {
        var params = new $QueryParams({name: 'Jeff'});
        expect($http.fullUrl('/users?hair=brown', params)).toBe('/users?hair=brown&name=Jeff');
      });
    });
  });


  //TODO (jeffbcross): this is a badly-placed test, does not belong in unit
  //It's also bad because it relies on loading a Karma script
  //This test is merely a guide to make sure I don't lose my way
  xit('should actually execute the request', function(done) {
    inject($Http, function($http) {
      $http.request({
        method: 'GET',
        url: 'http://localhost:9877/base/node_modules/pipe/node_modules/karma-requirejs/lib/adapter.js'
      }).
      then(function(res) {
        expect(res).toContain('monkey patch');
        done();
      });
    });
  });
});
