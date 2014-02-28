import {$HttpBackend} from './HttpBackend';
import {Inject} from '../node_modules/di/src/annotations';
import {$Window} from './Window';

@Inject($HttpBackend, $Window)
class $Http {
  constructor ($httpBackend, $window) {
    this.backend_ = $httpBackend;
    this.$window_ = $window;
  }

  req (config) {
    this.method = config.method || 'get';
    this.url = config.url;
    this.data = config.data;
    this.params = config.params;
    this.backend_.request(this);
  }

  encodeValue (value) {
    switch (typeof value) {
      case 'object':
        value = JSON.stringify(value);
        break;
      default:
        value = value.toString();
    }

    return this.$window_.encodeURIComponent(value).
            replace('%3A', ':').
            replace('%20','+').
            replace('%24', '$').
            replace('%40', '@');
  }

  encodeParams () {
    var queryString, orderedKeys, key, encodedKey, value, arg, i;
    if (!this.params) return '';

    queryString = this.url.indexOf('?') > -1 ? '&' : '?';
    orderedKeys = Object.keys(this.params).sort();

    while (key = orderedKeys.shift()) {
      encodedKey = this.encodeValue(key);
      queryString += encodedKey;
      queryString += '=';
      value = this.params[key];
      if (Array.isArray(value)) {
        for (i = 0; i < value.length; i++) {
          arg = value[i];
          queryString += this.encodeValue(arg);
          if (i + 1 < value.length) queryString += '&' + encodedKey + '=';
        }
      }
      else {
        queryString += this.encodeValue(value);
      }


      queryString += orderedKeys.length ? '&' : '';
    }

    return queryString;
  }

  fullUrl () {
    var params = this.encodeParams();
    return this.url + params;
  }
}

export {$Http};
