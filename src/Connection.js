import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';

/**
 * Manages state and properties of a single connection
 * @param {String} method Method used to communicate with host
 * @param {String} url Location with which to establish a connection
 * @param {$QueryParams} params
 * @param {$RequestData} data
 */
export class $Connection {
  constructor(
      method: String,
      url: String,
      params: $QueryParams,
      data: $RequestData) {
    this.method = method;
    this.url = url;
    this.params = params;
    this.data_ = data;
    this.data = data.serialize();
  }

  then(success, failure) {
    if (typeof success === 'function') {
      this.promise = new Promise(success, failure);
    }

  }

  success(callback) {
    // this.promise = new Promise(callback);
    // this.onSuccess = callback;
    // console.log('connection success', this);
  }

  /**
   * @returns {String} fully-qualified URL to request, including encoded query
   * parameters.
   */
  fullUrl () {
    return this.url + this.params.toQueryString(this.url.indexOf('?') > -1);
  }
}