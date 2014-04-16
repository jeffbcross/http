import {$XHRConnection, $ConnectionFactory} from './XHRConnection';
import {Inject} from 'di/annotations';
import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';

export class $Http {
  @Inject($ConnectionFactory)
  constructor (Connection) {
    this.ConnectionClass = Connection;
  }

  request(config) {
    var connection = new this.ConnectionClass(
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
