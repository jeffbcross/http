import {$Http} from '../src/Http';
import {assert} from 'assert';
import {ConnectionMock, ConnectionMockBackend, ConnectionMockFactory, ResponseMap} from './mocks/ConnectionMock';
import {inject, use} from 'di/testing';
import {PromiseBackend} from 'deferred/PromiseMock';

describe('$ConectionMock', function() {
  it('should')

  describe('@Provide', function() {
    it('should be injectable into $Http', function() {
      use(ConnectionMockFactory);
      inject($Http, function($http) {
        expect($http.ConnectionClass).toBe(ConnectionMock);
      });
    });
  });

  describe('.whenRequest()', function() {
    it('should add the request signature to a class-level map', function() {
      ConnectionMockBackend.whenRequest('GET', '/users');
      var responseMap = ConnectionMockBackend.requestResponseMap.get('GET').
          get('/users');
      assert.type(responseMap, ResponseMap);
    });


    it('should return an object containing a respond function', function() {
      var connection = new ConnectionMock();
      assert.type(
          ConnectionMockBackend.whenRequest('GET', '/users').respond,
          Function);
    });
  });


  describe('.verifyNotOustandingResponses', function() {

  });


  describe('.verifyNoOutstandingRequests()', function() {

  });
});

describe('ResponseMap', function() {
  describe('constructor', function() {

    it('should set body and code values to null', function() {
      var responseMap = new ResponseMap();
      expect(responseMap.get('body')).toBe(null);
      expect(responseMap.get('code')).toBe(null);
    });
  });


  describe('.respond()', function() {
    it('should set body and code on the map', function() {
      var res = 'The time is 2:45PM';
      var responseMap = new ResponseMap();
      responseMap.respond(200, res);
      expect(responseMap.get('body')).toBe(res);
      expect(responseMap.get('code')).toBe(200);
    });


    it('should require code to be a number', function() {

    });


    it('should require body to be a string');
  });
});


describe('misplaced integration tests', function() {
  it('should allow faking a response for a given method/url', function() {
    use(ConnectionMockFactory);
    inject($Http, function($http) {
      var promiseBackend = new PromiseBackend();
      promiseBackend.forkZone().run(function() {
        var response = '{"users":["Jeff"]}';
        var responseSpy = jasmine.createSpy();
        ConnectionMockBackend.whenRequest('GET', '/users').respond(200, response);
        $http.request('GET', '/users').then(responseSpy);
        ConnectionMockBackend.flush();
        expect(responseSpy).toHaveBeenCalledWith(response);
      });
    });
  });
});
