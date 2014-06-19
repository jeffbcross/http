import {XHRConnection} from './XHRConnection';
import {assert} from 'assert';
import {serialize} from './Serialize';
import {toQueryString} from './QueryParams';
import {Provide} from 'di/annotations';

class Http {
  constructor () {
    this.globalInterceptors = {
      request: [],
      requestError: [],
      response: [],
      responseError: []
    };
  }

  request (method:string, url:string, options) {
    var queryParams, requestData, connection;
    assert.type(method, assert.string);
    assert.type(url, assert.string);

    queryParams = (options && options.params || {});
    requestData = (options && options.data);
    var request = {
      method: method,
      url: this.fullUrl(url, queryParams),
      headers: {},
      params: queryParams,
      data: requestData
    };

    this.globalInterceptors.request.forEach(function(fn) {
      request = fn(request);
    });

    connection = new (options && options.ConnectionClass || XHRConnection)();

    Object.keys(request.headers).forEach(function(key) {
      connection.setRequestHeader(key, request.headers[key]);
    });

    connection.open(request.method, request.url);
    connection.send(serialize(request.data));

    return connection;
  }

  fullUrl (url:string, params) {
    return url + toQueryString(params, url.indexOf('?') > -1);
  }
}

export {Http};
