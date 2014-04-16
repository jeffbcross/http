import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';
import {Inject} from 'di/annotations';
import {Injector} from 'di/injector';
import {Deferred} from 'deferred/Deferred';
import {assert} from 'assert';

/**
 * Manages state of a single connection
 */
export class $Connection {
  constructor() {
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
  /**
   * Called when something goes horribly wrong with the request
   */
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
}

export class $ConnectionFactory {
  constructor() {
    return $Connection;
  }
}