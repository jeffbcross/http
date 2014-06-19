import {XHRConnection} from './XHRConnection';
import {assert} from 'assert';
import {serialize} from './Serialize';
import {toQueryString} from './QueryParams';
import {Provide} from 'di/annotations';

class Request {
  constructor ({method, url, params, data, headers}) {
    this.method = method;
    this.url = fullUrl(url, params || {});
    this.params = params || {};
    this.data = data;
    this.headers = headers || {};
  }
}

class Http {
  constructor () {
    this.globalInterceptors = {
      request: [],
      requestError: [],
      response: [],
      responseError: []
    };
  }

  request (config) {
    var connection, request, promise, http = this;
    var {method, url, params, data, headers} = config;
    assert.type(method, assert.string);
    assert.type(url, assert.string);

    request = new Request(config);
    request = this._processRequest(request);
    connection = new (config.ConnectionClass || XHRConnection)();

    Object.keys(request.headers).forEach(function(key) {
      connection.setRequestHeader(key, request.headers[key]);
    });

    connection.open(request.method, request.url);
    connection.send(serialize(request.data));

    promise = new Promise(function(resolve, reject) {
      connection.then(function(response) {
        resolve(http._processResponse(response));
      }, function(reason) {
        reject(http._processResponseError(reason));
      });
    });
    promise.connection = connection;

    return promise;
  }

  _processRequest (request:Request) {
    this.globalInterceptors.request.forEach(function(fn) {
      request = fn(request);
    });
    return request;
  }

  //TODO: handle normalized response object, pending implementation
  _processResponse (response) {
    this.globalInterceptors.response.forEach(function(intcpt) {
      response = intcpt(response);
    });
    return response;
  }

  //TODO: handle normalized response object, pending implementation
  _processResponseError (response) {
    this.globalInterceptors.responseError.forEach(function(intcpt) {
      response = intcpt(response);
    });
    return response;
  }
}

function fullUrl (url:string, params) {
  return url + toQueryString(params, url.indexOf('?') > -1);
}

export {Http, Request, fullUrl};
