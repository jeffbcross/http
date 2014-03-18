export class $QueryParams extends Map {
  constructor (params) {
    this.params = params;
  }

  get () {

  }
  /**
   * Set a parameter to new value of any type.
   */
  set (key:string, value:string) {
    this.params[key] = value;
  }

  setArray (key:string, value) {

  }

  unset (key:string, value) {

  }

  /**
   * Serialize the parameters into a queryString, including the leading "?" or
   * "&". If isAppended is truthy, the queryString should begin with "&".
   */
  toQueryString (isAppended) {
    var queryString, orderedKeys, key, encodedKey, value;
    if (!this.params) return '';

    queryString = isAppended ? '&' : '?';
    orderedKeys = Object.keys(this.params).sort();

    while (key = orderedKeys.shift()) {
      encodedKey = $QueryParams._encodeValue(key);
      queryString += encodedKey;
      queryString += '=';
      value = this.params[key];


      queryString += $QueryParams._encodeValue(value, encodedKey);
      queryString += orderedKeys.length ? '&' : '';
    }

    return queryString;
  }

  static _encodeValue (value, encodedKey) {
    var iVal, i, queryString = '';
    if (Array.isArray(value)) {
      if (!encodedKey) {
        throw new Error('Missing 2nd argument: "encodedKey"');
      }

      for (i = 0; i < value.length; i++) {
        iVal = value[i];
        queryString += $QueryParams._encodeValue(iVal);
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