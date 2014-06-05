import {fullUrl, request} from '../src/Http';
import {$Connection} from '../src/XHRConnection';
import {$RequestData} from '../src/RequestData';
import {$QueryParams} from '../src/QueryParams';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {Injector} from 'di/injector';
import {inject, use} from 'di/testing';
import {ConnectionMock, ConnectionMockFactory} from './mocks/ConnectionMock';

describe('request()', function() {
  beforeEach(function() {
    this.openSpy = spyOn($Connection.prototype, 'open');
    this.sendSpy = spyOn($Connection.prototype, 'send');
  });


  it('should complain if method is not a string', function() {
    expect(function() {
      request(undefined, '/users')
    }).toThrow();
    expect(function() {
      request('GET', '/users')
    }).not.toThrow();
  });


  it('should complain if url is not a string', function() {
    expect(function() {
      request('GET', undefined);
    }).toThrow();
    expect(function() {
      request('GET', '/users');
    }).not.toThrow();
  });


  it('should serialize data before calling open', function() {
    request('GET', '/users', {data: {interests: 'JavaScript'}});
    expect(this.sendSpy.calls.all()[0].args[0]).toBe('{"interests":"JavaScript"}');
  });


  it('should create a new Connection from XHRConnection if no ConnectionClass provided',
      function(){
        expect(request('GET', '/users')).toBeInstanceOf($Connection);
      });


  it('should use provided ConnectionClass to instantiate a Connection', function() {
    var connection = request('GET', '/users', {
      ConnectionClass: ConnectionMock
    });
    expect(connection).toBeInstanceOf(ConnectionMock);
  });


  it('should call open on the connection', function() {
    request('GET', '/users');
    expect(this.openSpy).toHaveBeenCalledWith('GET', '/users');
  });


  it('should call send on the connection', function() {
    request('GET', '/users');
    expect(this.sendSpy).toHaveBeenCalled();
  });


  it('should pass data to send', function() {
    var data = '{"user" : "jeffbcross"}';
    request('GET', '/users', {data: data});
    expect(this.sendSpy).toHaveBeenCalledWith(data);
  });


  //TODO (jeffbcross): this is a badly-placed test, does not belong in unit
  //It's also bad because it relies on loading a Karma script
  //This test is merely a guide to make sure I don't lose my way
  xit('should actually execute the request', function(done) {
    request('GET', '/base/node_modules/pipe/node_modules/karma-requirejs/lib/adapter.js').
    then(function(res) {
      console.log('done!')
      expect(res).toContain('monkey patch');
      done();
    }, function(reason){
      throw new Error(reason);
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
