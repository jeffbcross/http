import {$Connection} from './XHRConnection';
import {assert} from 'assert';
import {serialize} from './Serialize';
import {toQueryString} from './QueryParams';

//TODO (@jeffbcross): support responseType in options
function request(method, url, options) {
  var queryParams, requestData, connection;
  assert.type(method, assert.string);
  assert.type(url, assert.string);

  queryParams = (options && options.params || {});
  requestData = (options && options.data);
  connection = new (options && options.ConnectionClass || $Connection)();
  url = fullUrl(url, queryParams);

  connection.open(method, url);
  connection.send(serialize(requestData));

  return connection;
}

function fullUrl(url:string, params) {
  return url + toQueryString(params, url.indexOf('?') > -1);
}

export {fullUrl, request};
