import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';
import {Inject} from 'di/annotations';
import {Injector} from 'di/injector';
import {Deferred} from 'deferred/Deferred';
import {assert} from 'assert';

/**
 * Manages state and properties of a single connection
 * @param {String} method Method used to communicate with host
 * @param {String} url Location with which to establish a connection
 * @param {$QueryParams} params
 * @param {$RequestData} data
 */
export class $XHRConnection {
  constructor(
      method: string,
      url: string,
      params: $QueryParams,
      data: $RequestData) {
    this.method = method;
    this.url = url;
    this.params = params;
    this.data_ = data;
    this.data = data.serialize();

    this.xhr_ = new XMLHttpRequest();

    this.xhr_.onerror = this.onError;
    this.xhr_.addEventListener('load', this.onLoad.bind(this));
    this.xhr_.addEventListener('error', this.onError.bind(this));
    this.deferred = new Deferred();
    this.promise = this.deferred.promise;
  }

  then (resolve, reject) {
    this.promise.then(resolve, reject);
    return this;
  }

  success (callback) {
    this.promise.then(callback);
  }

  /**
   * Called when the request transfer is completed, regardless of the status of
   * the response.
   */
  onLoad (evt:Object) {
    this.deferred.resolve(this.xhr_.responseText);
  }

  onError (evt:Object) {
    this.deferred.reject(evt);
  }

  error(callback) {
    this.promise.then(null, callback);
  }

  open (method, url) {
    assert.type(method, assert.string);
    assert(url, assert.string);
    this.method = method;
    this.url = url;
    this.xhr_.open(this.method, this.url);
  }

  send (data) {
    this.xhr_.send(data);
  }

  /**
   * @returns {String} fully-qualified URL to request, including encoded query
   * parameters.
   */
  fullUrl () {
    return this.url + this.params.toQueryString(this.url.indexOf('?') > -1);
  }
}

export class $ConnectionFactory {
  constructor() {
    return $XHRConnection;
  }
}