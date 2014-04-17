import {$QueryParams} from './QueryParams';
import {$RequestData} from './RequestData';
import {Inject} from 'di/annotations';
import {Injector} from 'di/injector';
import {Deferred} from 'deferred/Deferred';
import {assert} from 'assert';

var XHRDataTypes = assert.define('XHRDataTypes', function(value) {
  if (value instanceof Document) {
    //pass
    //related to issue https://github.com/angular/assert/issues/5
  }
  else {
    assert(value).is(DataView, Blob, Document, assert.string, FormData);
  }
});

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
    if (this.xhr_.readyState === 1) {
      throw new Error('Connection is already open');
    }
    this.method = method;
    this.url = url;
    this.xhr_.open(this.method, this.url);
  }

  send (data) {
    if (typeof data !== 'undefined') {
      assert.type(data, XHRDataTypes);
    }

    this.xhr_.send(data);
  }
}

export class $ConnectionFactory {
  constructor() {
    return $Connection;
  }
}