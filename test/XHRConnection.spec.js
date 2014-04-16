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
    assert.type($XHRConnection, IConnection);
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


    it('should add a load event listener', function() {
      var listenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(listenerSpy.calls.all()[0].args[0]).toBe('load');
    });


    it('should add an error event listener', function() {
      var listenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      new $XHRConnection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);

      expect(listenerSpy.calls.all()[1].args[0]).toBe('error');
      assert.type(listenerSpy.calls.all()[1].args[1], Function);
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


  describe('.promise', function() {
    it('should return a promise', function() {
      assert.type(new $XHRConnection(
        'GET',
        '/users',
        new $QueryParams,
        new $RequestData).promise, Promise);
    })
  });
});
