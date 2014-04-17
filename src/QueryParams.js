import {assert} from 'assert';

class $QueryParams {
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
}

/**
 * Serialize the parameters into a queryString, including the leading "?" or
 * "&". If isAppended is truthy, the queryString should begin with "&".
 */
function toQueryString (qp: $QueryParams, isAppended) {
  var queryString, orderedKeys, key, encodedKey, value;
  if (typeof isAppended !== 'undefined') {
    assert.type(isAppended, assert.boolean);
  }
  if (Object.keys(qp.params).length === 0) return '';

  queryString = isAppended ? '&' : '?';
  orderedKeys = Object.keys(qp.params).sort();

  while (key = orderedKeys.shift()) {
    encodedKey = encodeValue(key);
    queryString += encodedKey;
    queryString += '=';
    value = qp.params[key];


    queryString += encodeValue(value, encodedKey);
    queryString += orderedKeys.length ? '&' : '';
  }

  return queryString;
}

function encodeValue (value, encodedKey) {
  var iVal, i, queryString = '';
  if (Array.isArray(value)) {
    if (!encodedKey) {
      throw new Error('Missing 2nd argument: "encodedKey"');
    }

    for (i = 0; i < value.length; i++) {
      iVal = value[i];
      queryString += encodeValue(iVal);
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

export {$QueryParams, encodeValue, toQueryString}
