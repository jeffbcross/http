import {$Connection} from './Connection';
import {$HttpBackend} from './HttpBackend';
import {Inject} from 'di/annotations';
import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';

@Inject($HttpBackend)
export class $Http {
  constructor ($httpBackend) {
    this.backend_ = $httpBackend;
  }

  req (config) {
    var connection = new $Connection (
        config.method,
        config.url,
        new $QueryParams(config.params || {}),
        new $RequestData(config.data)
    );

    this.backend_.request(connection);

    return connection;
  }

  post (url, data, options) {
    return this.req({
      method: 'POST',
      url: url,
      data: data
    });
  }
}
