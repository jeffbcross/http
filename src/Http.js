import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';
import {$XHRConnection, $ConnectionFactory} from './XHRConnection';
import {assert} from 'assert';
import {Inject} from 'di/annotations';

export class $Http {
  @Inject($ConnectionFactory)
  constructor (Connection) {
    this.ConnectionClass = Connection;
  }

  request(method, url, options) {
    var queryParams, requestData, connection, fullUrl;
    assert.type(method, assert.string);
    assert.type(url, assert.string);

    queryParams = new $QueryParams(options && options.params || {});
    requestData = new $RequestData(options && options.data);
    connection = new this.ConnectionClass();

    fullUrl = this.fullUrl(url, queryParams);

    connection.open(method, fullUrl);
    connection.send(requestData.serialize());

    return connection;
  }

  fullUrl(url, params) {
    return url + params.toQueryString(url.indexOf('?') > -1);
  }
}
