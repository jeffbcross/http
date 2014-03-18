import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';
import {Inject} from 'di/annotations';
import {Injector} from 'di/injector';

/**
 * Manages state and properties of a single connection
 * @param {String} method Method used to communicate with host
 * @param {String} url Location with which to establish a connection
 * @param {$QueryParams} params
 * @param {$RequestData} data
 */
export class $Connection {
  constructor(
      method:string,
      url:string,
      params: $QueryParams,
      data: $RequestData,
      MockPromise) {
    this.method = method;
    this.url = url;
    this.params = params;
    this.data_ = data;
    this.data = data.serialize();

    this.promise = new (MockPromise || Promise)(function(resolve, reject) {
      this.reject = reject;
      this.resolve = resolve;
    }.bind(this));
  }

  then (resolve, reject) {
    this.promise.then(resolve, reject);
    return this;
  }

  success(callback) {
    this.promise.then(callback);
  }

  /**
   * Called when a request is completed, regardless of the status of the
   * response.
   * TODO: Apply some real logic here.
   */
  onComplete (res) {
    if (typeof res !== 'undefined') {
      this.resolve.call(this.promise, res);
    }
    else {
      this.reject.call(this.promise, res);
    }
  }

  error(callback) {
    this.promise.then(null, callback);
  }

  send() {

  }

  /**
   * @returns {String} fully-qualified URL to request, including encoded query
   * parameters.
   */
  fullUrl () {
    return this.url + this.params.toQueryString(this.url.indexOf('?') > -1);
  }
}
