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
      requestError: [],
      response: [],
      responseError: []
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
        resolve(http._processResponse(response));
      }, function(reason) {
        reject(http._processResponseError(reason));
      });
    });
    promise.connection = connection;

    return promise;
  }

  _processRequest (request:IRequest) {
    this.globalInterceptors.request.forEach(function(fn) {
      request = fn(request);
    });
    return request;
  }

  //TODO: handle normalized response object, pending implementation
  _processResponse (response:IResponse) {
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

export {Http, fullUrl};
