import {XHRConnection} from './XHRConnection';
import {assert} from 'assert';
import {serialize} from './Serialize';
import {toQueryString} from './QueryParams';
import {Provide} from 'di/annotations';
import {IResponse} from './IResponse';
import {IRequest} from './IRequest';

class Http {
  constructor () {
    this.globalInterceptors = {
      request: [],
      response: []
    };
  }

  request (config) {
    var connection, request, promise, http = this;
    var {method, url, params, data, headers, responseType} = config;
    assert.type(method, assert.string);
    assert.type(url, assert.string);

    request = {
      method: method,
      url: url,
      data: serialize(data),
      responseType: responseType || 'text',
      params: new Map(),
      headers: new Map()
    };
    request = this._processRequest(request);
    connection = new (config.ConnectionClass || XHRConnection)();

    Object.keys(request.headers).forEach(function(key) {
      connection.setRequestHeader(key, request.headers[key]);
    });

    promise = new Promise(function(resolve, reject) {
      connection.open(request.method, request.url);
      connection.send(request.data);
      connection.then(function(response) {
        resolve(http._processResponse(undefined, request, response));
      }, function(reason) {
        reject(http._processResponse(reason, request));
      });
    });

    // TODO: Remove connection from promise.
    // Only here to verify which Connection was used
    promise.connection = connection;

    return promise;
  }

  _processRequest (request:IRequest) {
    this.globalInterceptors.request.forEach(function(fn) {
      request = fn(request);
    });
    return request;
  }

  _processResponse (err, req:IRequest, res) {
    var http = this;
    if (res) assert.type(res, IResponse);
    return new Promise(function(resolve, reject) {
      var i = 0;
      function callNext(error) {
        err = error || err;
        if (i === http.globalInterceptors.response.length) {
          if (err) return reject(err);
          resolve(res);
        }
        http.globalInterceptors.response[i++](err, req, res, callNext);
      }
      callNext();
    });
  }
}

function fullUrl (url:string, params) {
  return url + toQueryString(params, url.indexOf('?') > -1);
}

export {Http, fullUrl};
