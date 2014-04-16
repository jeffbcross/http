import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';
import {Inject} from 'di/annotations';
import {Injector} from 'di/injector';
import {Deferred} from 'deferred/Deferred';
import {assert} from 'assert';

/**
 * Manages state and properties of a single connection
 * @param {$QueryParams} params
 * @param {$RequestData} data
 */
export class $XHRConnection {
  constructor(params:$QueryParams, data:$RequestData) {
    this.params = params;
    this.data_ = data;
    this.data = data.serialize();

    this.xhr_ = new XMLHttpRequest();
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

  error(callback) {
    this.promise.then(null, callback);
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

  open (method:string, url:string) {
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