import {$RequestData} from '../src/RequestData';
import {$QueryParams} from '../src/QueryParams';
import {$XHRConnection} from '../src/XHRConnection';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {inject, use} from 'di/testing';
import {PromiseBackend, PromiseMock} from 'deferred/PromiseMock';

describe('$XHRConnection', function() {
  var sampleParams = new $QueryParams({id: 1});
  var sampleRequestData = new $RequestData({user: 'Tobias'});

  it('should implement IConnection', function() {
    assert.type($XHRConnection, IConnection)
  });

  describe('constructor', function() {
    it('should set the method to the instance', function() {
      var connection = new $XHRConnection(
          'GET',
          '',
          sampleParams,
          sampleRequestData);
      expect(connection.method).toBe('GET');
    });


    it('should complain if provided method is not a string', function() {
      expect(function() {
        new $XHRConnection({}, '/items', sampleParams, sampleRequestData);
      }).toThrow();
      expect(function() {
        new $XHRConnection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should set the url to the instance', function () {
      var connection = new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.url).toBe('/items');
    });


    it('should complain if invalid url type provided', function() {
      expect(function() {
        new $XHRConnection('GET', {}, sampleParams, sampleRequestData);
      }).toThrow();
      expect(function() {
        new $XHRConnection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should set the provided $QueryParams to the instance', function() {
      var connection = new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.params).toBe(sampleParams);
    });


    it('should complain if invalid $QueryParams type provided', function() {
      expect(function() {
        new $XHRConnection('GET', '/items', {}, sampleRequestData);
      }).toThrow();
      expect(function() {
        new $XHRConnection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should set the provided $RequestData to the instance', function() {
      var connection = new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.data_).toBe(sampleRequestData);
    });

    it('should set the serialized data to the instance', function() {
      var connection = new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.data).toBe(sampleRequestData.serialize());
    });


    it('should complain if invalid $RequestData type provided', function() {
      expect(function() {
        new $XHRConnection('GET', '/items', sampleParams, {});
      }).toThrow();
      expect(function() {
        new $XHRConnection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should create a promise for the connection', function() {
      var connection = new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);

      expect(connection.promise instanceof Promise).toBe(true);
    });
  });


  describe('.open()', function() {
    it('should complain if no method provided', function() {
      var connection = new $XHRConnection(
        '',
        '',
        new $QueryParams(),
        new $RequestData());
      expect(function() {
        connection.open(undefined, '/users');
      }).toThrow();
    });


    it('should complain if open is called more than once', function() {

    });
  });


  describe('.send()', function() {

  });


  describe('instance', function() {
    it('should be thenable at the instance level', function(){
      var connection = new $XHRConnection(
          '',
          '',
          new $QueryParams(),
          new $RequestData());
      expect(typeof connection.then).toBe('function');
    });
  });


  xdescribe('.promise', function() {
    beforeEach(function() {
      this.zone = zone.fork({
        onZoneEnter: function() {
          PromiseBackend.patchWithMock();
        },
        onZoneLeave: function() {
          PromiseBackend.verifyNoOutstandingTasks();
          PromiseBackend.restoreNativePromise();
        }
      });
    });

    afterEach(function() {

    });

    it('should call the then functions in order on success', function () {
      this.zone.run(function() {
        var firstSpy = jasmine.createSpy('firstSpy').and.returnValue(1);
        var secondSpy = jasmine.createSpy('secondSpy');
        var connection = new $XHRConnection(
            'GET',
            '/items',
            sampleParams,
            sampleRequestData);
        connection.
          then(firstSpy).
          then(secondSpy);

        connection.onComplete('foo');

        PromiseBackend.flush();

        PromiseBackend.flush();
        expect(firstSpy).toHaveBeenCalledWith('foo');
        expect(secondSpy).toHaveBeenCalledWith(1);
      });
    });


    it('should call then functions in order on error', function() {
      var responses = [];
      var connection = new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      connection.
        then(null, function(val) {
          responses.push(1);
        }).
        then(null, function(val) {
          responses.push(2);
        });
      expect(responses).toEqual([]);

      connection.onComplete(undefined, 'foo');
      expect(responses).toEqual([1,2]);
    })
  });

});
