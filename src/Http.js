import {$XHRConnection} from './XHRConnection';
import {Inject} from 'di/annotations';
import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';

export class $Http {
  constructor () {
  }

  request(config) {
    var connection = new $XHRConnection (
        config.method,
        config.url,
        new $QueryParams(config.params || {}),
        new $RequestData(config.data)
    );

    connection.open(connection.method, connection.url);
    connection.send(connection.data);

    return connection;
  }

  post(url, data, options) {
    return this.req({
      method: 'POST',
      url: url,
      data: data
    });
  }
}
