import {$Connection} from '../src/Connection';
import {$QueryParams} from '../src/QueryParams';
import {$RequestData} from '../src/RequestData';
import {inject, use} from 'di/testing';
import {$MockPromise} from './mocks/Promise';

describe('$Connection', function() {
  var sampleParams = new $QueryParams({id: 1});
  var sampleRequestData = new $RequestData({user: 'Tobias'});

  describe('constructor', function() {
    it('should set the method to the instance', function() {
      var connection = new $Connection(
          'GET',
          '',
          sampleParams,
          sampleRequestData);
      expect(connection.method).toBe('GET');
    });


    it('should complain if provided method is not a string', function() {
      expect(function() {
        new $Connection({}, '/items', sampleParams, sampleRequestData);
      }).toThrow();
      expect(function() {
        new $Connection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should set the url to the instance', function () {
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.url).toBe('/items');
    });


    it('should complain if invalid url type provided', function() {
      expect(function() {
        new $Connection('GET', {}, sampleParams, sampleRequestData);
      }).toThrow();
      expect(function() {
        new $Connection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should set the provided $QueryParams to the instance', function() {
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.params).toBe(sampleParams);
    });


    it('should complain if invalid $QueryParams type provided', function() {
      expect(function() {
        new $Connection('GET', '/items', {}, sampleRequestData);
      }).toThrow();
      expect(function() {
        new $Connection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should set the provided $RequestData to the instance', function() {
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.data_).toBe(sampleRequestData);
    });

    it('should set the serialized data to the instance', function() {
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);
      expect(connection.data).toBe(sampleRequestData.serialize());
    });


    it('should complain if invalid $RequestData type provided', function() {
      expect(function() {
        new $Connection('GET', '/items', sampleParams, {});
      }).toThrow();
      expect(function() {
        new $Connection('GET', '/items', sampleParams, sampleRequestData);
      }).not.toThrow();
    });


    it('should create a promise for the connection', function() {
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData);

      expect(connection.promise instanceof Promise).toBe(true);
    });
  });


  describe('instance', function() {
    it('should be thenable at the instance level', function(){
      var connection = new $Connection(
          '',
          '',
          new $QueryParams(),
          new $RequestData());
      expect(typeof connection.then).toBe('function');
    });
  })


  describe('.promise', function() {
    it('should call the then functions in order on success', function () {
      var responses = [];
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData,
          $MockPromise);
      connection.
        then(function(val) {
          responses.push(1);
        }).
        then(function(val) {
          responses.push(2);
        });
      expect(responses).toEqual([]);

      connection.onComplete('foo');
      connection.promise.flush();
      expect(responses).toEqual([1,2]);
    });


    it('should call then functions in order on error', function() {
      var responses = [];
      var connection = new $Connection(
          'GET',
          '/items',
          sampleParams,
          sampleRequestData,
          $MockPromise);
      connection.
        then(null, function(val) {
          responses.push(1);
        }).
        then(null, function(val) {
          responses.push(2);
        });
      expect(responses).toEqual([]);

      connection.onComplete(undefined, 'foo');
      connection.promise.flush();
      expect(responses).toEqual([1,2]);
    })
  });

});
