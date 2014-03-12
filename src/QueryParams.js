export class $QueryParams {
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