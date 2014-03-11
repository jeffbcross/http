import {$HttpBackend} from './HttpBackend';
import {Inject} from '../node_modules/di/src/annotations';


@Inject($HttpBackend)
class $Http {
  constructor ($httpBackend) {
    this.backend_ = $httpBackend;
  }

  req (config) {
    var connection = new $$Connection (
        config.method,
        config.url,
        new $$QueryParams(config.params),
        new $$RequestData(config.data)
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

class $$QueryParams {
  constructor (params: Object) {
    this.params = params;
  }

  toQueryString (isAppended) {
    var queryString, orderedKeys, key, encodedKey, value;
    if (!this.params) return '';

    queryString = isAppended ? '&' : '?';
    orderedKeys = Object.keys(this.params).sort();

    while (key = orderedKeys.shift()) {
      encodedKey = this.encodeValue(key);
      queryString += encodedKey;
      queryString += '=';
      value = this.params[key];


      queryString += this.encodeValue(value, encodedKey);
      queryString += orderedKeys.length ? '&' : '';
    }

    return queryString;
  }

  encodeValue (value, encodedKey) {
    var iVal, i, queryString = '';
    if (Array.isArray(value)) {
      for (i = 0; i < value.length; i++) {
        iVal = value[i];
        queryString += this.encodeValue(iVal);
        if (i + 1 < value.length) queryString += '&' + encodedKey + '=';
      }

      return queryString;
    }
    else {
      switch (typeof value) {
        case 'object':
          value = JSON.stringify(value);
          break;
        default:
          value = value.toString();
      }
    }

    return window.encodeURIComponent(value).
            replace('%3A', ':').
            replace('%20', '+').
            replace('%24', '$').
            replace('%40', '@');
  }
}

/**
 *
 * @param {String|Object} data
 */
class $$RequestData {
  constructor (data) {
    this.data = data;
  }

  serialize () {
    if (this.data instanceof Object) {
      return JSON.stringify(this.data);
    }
    else {
      return this.data;
    }
  }
}

/**
 * Manages state and properties of a single connection
 * @param {String} method Method used to communicate with host
 * @param {String} url Location with which to establish a connection
 * @param {$$QueryParams} params
 * @param {$$RequestData} data
 */
class $$Connection {
  constructor(
      method: String,
      url: String,
      params: $$QueryParams,
      data: $$RequestData) {
    this.method = method;
    this.url = url;
    this.params = params;
    this.data_ = data;
    this.data = data.serialize();
  }

  success (callback) {
    this.onSuccess = callback;
    console.log('connection success', this);
  }

  /**
   * @returns {String} fully-qualified URL to request, including encoded query
   * parameters.
   */
  fullUrl () {
    return this.url + this.params.toQueryString(this.url.indexOf('?') > -1);
  }
}

export {$Http, $$Connection};
