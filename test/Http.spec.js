import {$Http} from '../src/Http';
import {$XHRConnection} from '../src/XHRConnection';
import {$RequestData} from '../src/RequestData';
import {Injector} from 'di/injector';
import {inject, use} from 'di/testing';

describe('Http', function () {
  describe('.request()', function() {
    it('should create a new Connection', inject($Http, function($http) {
      expect($http.request({
        method: 'GET',
        url: '/users'
      })).toBeInstanceOf($XHRConnection);
    }));


    it('should call open on the connection', inject($Http, function($http) {
      var openSpy = spyOn($XHRConnection.prototype, 'open');
      $http.request({
        method: 'GET',
        url: '/users'
      });
      expect(openSpy).toHaveBeenCalledWith('GET', '/users');
    }));


    it('should call send on the connection', inject($Http, function($http) {
      var sendSpy = spyOn($XHRConnection.prototype, 'send');
      $http.request({
        method: 'GET',
        url: '/users'
      });
      expect(sendSpy).toHaveBeenCalled();
    }));


    it('should pass data to send', inject($Http, function($http) {
      var sendSpy = spyOn($XHRConnection.prototype, 'send');
      var data = '{"user" : "jeffbcross"}';
      $http.request({
        method: 'GET',
        url: '/users',
        data: data
      });
      expect(sendSpy).toHaveBeenCalledWith(data);
    }));
  });
});
