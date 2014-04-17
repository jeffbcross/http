import {$QueryParams, toQueryString} from './QueryParams';
import {$RequestData} from './RequestData';
import {$ConnectionFactory} from './XHRConnection';
import {assert} from 'assert';
import {IConnection} from './IConnection';
import {Inject} from 'di/annotations';

@Inject($ConnectionFactory)
class $Http {
  constructor (Connection) {
    assert.type(Connection, IConnection);
    this.ConnectionClass = Connection;
  }

  request(method, url, options) {
    var queryParams, requestData, connection;
    assert.type(method, assert.string);
    assert.type(url, assert.string);

    queryParams = new $QueryParams(options && options.params || {});
    requestData = new $RequestData(options && options.data);
    connection = new this.ConnectionClass();
    url = fullUrl(url, queryParams);

    connection.open(method, url);
    connection.send(requestData.serialize());

    return connection;
  }
}

function fullUrl(url:string, params:$QueryParams) {
  return url + toQueryString(params, url.indexOf('?') > -1);
}

export {fullUrl, $Http};
