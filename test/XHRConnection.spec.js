import {$RequestData} from '../src/RequestData';
import {$QueryParams} from '../src/QueryParams';
import {$Connection} from '../src/XHRConnection';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {inject, use} from 'di/testing';
import {PromiseBackend, PromiseMock} from 'deferred/PromiseMock';

describe('$Connection', function() {
  var sampleParams = new $QueryParams({id: 1});
  var sampleRequestData = new $RequestData({user: 'Tobias'});

  it('should implement IConnection', function() {
    assert.type($Connection, IConnection);
  });

  describe('constructor', function() {
    it('should create a promise for the connection', function() {
      var connection = new $Connection();
      expect(connection.promise instanceof Promise).toBe(true);
    });


    it('should add a load event listener', function() {
      var listenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      new $Connection();
      expect(listenerSpy.calls.all()[0].args[0]).toBe('load');
    });


    it('should add an error event listener', function() {
      var listenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      new $Connection();

      expect(listenerSpy.calls.all()[1].args[0]).toBe('error');
      assert.type(listenerSpy.calls.all()[1].args[1], Function);
    });
  });


  describe('.open()', function() {
    it('should complain if no method provided', function() {
      var connection = new $Connection(
        new $QueryParams(),
        new $RequestData());
      expect(function() {
        connection.open(undefined, '/users');
      }).toThrow();
    });

    it('should complain if provided method is not a string', function() {
      expect(function() {
        var connection = new $Connection();
        connection.open(undefined, '/users');
      }).toThrow();
      expect(function() {
        var connection = new $Connection();
        connection.open('GET', '/users');
      }).not.toThrow();
    });


    it('should set the method to the instance', function() {
      var connection = new $Connection(
          sampleParams,
          sampleRequestData);
      connection.open('GET', '/users');
      expect(connection.method).toBe('GET');
    });


    it('should complain if invalid url type provided', function() {
      expect(function() {
        var connection = new $Connection();
        connection.open('GET', undefined);
      }).toThrow();
      expect(function() {
        var connection = new $Connection();
        connection.open('GET', '/users');
      }).not.toThrow();
    });


    it('should set the url to the instance', function () {
      var connection = new $Connection();
      connection.open('GET', '/items');
      expect(connection.url).toBe('/items');
    });


    it('should complain if open is called more than once', function() {
      var connection = new $Connection();
      connection.open('GET', '/items');
      expect(function() {
        connection.open('GET', '/items');
      }).toThrow();
    });
  });


  describe('.send()', function() {
    it('should accept no data', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'send');
      var connection = new $Connection();
      connection.open('POST', '/assets');
      connection.send();
      expect(spy).toHaveBeenCalled();
    });


    it('should accept DataView data', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'send');
      var buffer = new ArrayBuffer();
      var view = new DataView(buffer);
      var connection = new $Connection();
      connection.open('POST', '/assets');
      connection.send(view);
      expect(spy).toHaveBeenCalledWith(view);
    });


    it('should accept Blob data', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'send');
      var blob = new Blob();
      var connection = new $Connection();
      connection.open('POST', '/assets');
      connection.send(blob);
      expect(spy).toHaveBeenCalledWith(blob);
    });


    it('should accept Document data', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'send');
      var connection = new $Connection();
      var doc = document.implementation.createDocument(null, 'doc');
      connection.open('POST', '/assets');
      connection.send(doc);
      expect(spy).toHaveBeenCalledWith(doc);
    });


    it('should accept String data', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'send');
      var connection = new $Connection();
      var body = 'POST ME!';
      connection.open('POST', '/assets');
      connection.send(body);
      expect(spy).toHaveBeenCalledWith(body);
    });


    it('should accept FormData data', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'send');
      var connection = new $Connection();
      var formData = new FormData();
      formData.append('user', 'Jeff');
      connection.open('POST', '/assets');
      connection.send(formData);
      expect(spy).toHaveBeenCalledWith(formData);
    });


    it('should complain when given an invalid type of data', function() {
      var connection = new $Connection();
      connection.open('POST', '/assets');
      expect(function() {
        connection.send(5);
      }).toThrow();

    });
  });


  describe('instance', function() {
    it('should be thenable at the instance level', function(){
      var connection = new $Connection(
          new $QueryParams(),
          new $RequestData());
      expect(typeof connection.then).toBe('function');
    });
  });


  describe('.promise', function() {
    it('should return a promise', function() {
      assert.type(new $Connection(
        new $QueryParams,
        new $RequestData).promise, Promise);
    })
  });


  describe('.success()', function() {

  });


  describe('.error()', function() {

  });
});
