import {$Http} from '../src/Http';
import {assert} from 'assert';
import {ConnectionMock, ConnectionMockBackend, ConnectionMockFactory, ResponseMap} from './mocks/ConnectionMock';
import {IConnection} from '../src/IConnection';
import {inject, use} from 'di/testing';
import {PromiseBackend} from 'deferred/PromiseMock';

describe('ConnectionMockBackend', function() {
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


  describe('.flush()', function() {
    it('should throw if no requestResponseMap exists', function() {
      expect(function() {
        delete ConnectionMockBackend.requestResponseMap;
        ConnectionMockBackend.flush();
      }).toThrow(new ReferenceError('There are no responses to fulfill'));
    });


    it('should throw if no connections exist', function() {
      expect(function() {
        ConnectionMockBackend.requestResponseMap = new Map();
        delete ConnectionMockBackend.connections;
        ConnectionMockBackend.flush();
      }).toThrow(new ReferenceError('There are no connections to resolve'));
    });


    it('should throw if connections list is of length zero', function() {
      expect(function() {
        ConnectionMockBackend.requestResponseMap = new Map();
        ConnectionMockBackend.connections = [];
        ConnectionMockBackend.flush();
      }).toThrow(new ReferenceError('There are no connections to resolve'));
    });


    it('should call resolve() each connection with a matching response',
        function() {
          ConnectionMockBackend.forkZone().run(function() {
            var requestResponseMap = new Map();
            ConnectionMockBackend.whenRequest('GET', '/users').respond(200, 'User!');
            var connection = new ConnectionMock();
            var resolveSpy = spyOn(connection.deferred, 'resolve').and.callThrough();
            connection.open('GET', '/users');
            connection.send();
            ConnectionMockBackend.flush();
            expect(resolveSpy).toHaveBeenCalledWith('User!');
          });
        });


    it('should ignore connections that have not yet executed', function() {
      ConnectionMockBackend.forkZone().run(function() {
        var requestResponseMap = new Map();
        ConnectionMockBackend.whenRequest('GET', '/users').respond(200, 'User!');
        var connection = new ConnectionMock();
        var resolveSpy = spyOn(connection.deferred, 'resolve').and.callThrough();
        connection.open('GET', '/users');
        expect(ConnectionMockBackend.flush).toThrow();
        expect(resolveSpy).not.toHaveBeenCalled();
      });
    });


    it('should call reject if the status is > 399', function() {
      ConnectionMockBackend.forkZone().run(function() {
        var requestResponseMap = new Map();
        ConnectionMockBackend.whenRequest('GET', '/users').respond(400, 'Not Found');
        var connection = new ConnectionMock();
        var rejectSpy = spyOn(connection.deferred, 'reject').and.callThrough();
        connection.open('GET', '/users');
        connection.send();
        ConnectionMockBackend.flush();
        expect(rejectSpy).toHaveBeenCalledWith('Not Found');
      });
    });
  });


  describe('.addConnection', function() {
    afterEach(function () {ConnectionMockBackend.connections = []})
    it('should verify that the connection implements IConnection', function() {
      expect(ConnectionMockBackend.addConnection).toThrow();
      expect(function() {
        ConnectionMockBackend.addConnection({})
      }).toThrow();
      ConnectionMockBackend.addConnection(new ConnectionMock());
    });


    it('should add the connection to an ordered list', function() {
      var connection1 = new ConnectionMock();
      var connection2 = new ConnectionMock();
      ConnectionMockBackend.connections = [];
      ConnectionMockBackend.addConnection(connection1);
      ConnectionMockBackend.addConnection(connection2);
      expect(ConnectionMockBackend.connections[0]).toBe(connection1);
      expect(ConnectionMockBackend.connections[1]).toBe(connection2);
      expect(ConnectionMockBackend.connections.length).toBe(2);
    });


    it('should create the collections list if not exist', function() {
      var connection = new ConnectionMock;
      delete ConnectionMockBackend.connections;
      expect(ConnectionMockBackend.connections).toBeUndefined();
      ConnectionMockBackend.addConnection(connection);
      expect(ConnectionMockBackend.connections.length).toBe(1);
    });
  });


  describe('.verifyNoOustandingResponses', function() {

  });


  describe('.verifyNoOutstandingRequests()', function() {

  });


  describe('.forkZone()', function() {
    it('should return a new zone from PromiseBackend', function() {
      var forked = ConnectionMockBackend.forkZone();
      assert.type(forked, Zone);
      expect(forked.onZoneEnter.toString()).toContain('patchWithMock()');
    });
  })
});


describe('ConectionMock', function() {
  it('should implement IConnection', function() {
    assert.type(ConnectionMock, IConnection);
  });


  describe('@Provide', function() {
    it('should be injectable into $Http', function() {
      use(ConnectionMockFactory);
      inject($Http, function($http) {
        expect($http.ConnectionClass).toBe(ConnectionMock);
      });
    });
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
      ConnectionMockBackend.forkZone().run(function() {
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
