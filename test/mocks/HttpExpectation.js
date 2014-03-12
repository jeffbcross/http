import {Utils} from '../../src/Utils';
/**
 * Previous implementation:
 * function MockHttpExpectation(method, url, data, headers) {
 *
 *   this.data = data;
 *   this.headers = headers;
 *
 *   this.match = function(m, u, d, h) {
 *     if (method != m) return false;
 *     if (!this.matchUrl(u)) return false;
 *     if (angular.isDefined(d) && !this.matchData(d)) return false;
 *     if (angular.isDefined(h) && !this.matchHeaders(h)) return false;
 *     return true;
 *   };
 *
 *   this.matchUrl = function(u) {
 *     if (!url) return true;
 *     if (angular.isFunction(url.test)) return url.test(u);
 *     return url == u;
 *   };
 *
 *   this.matchHeaders = function(h) {
 *     if (angular.isUndefined(headers)) return true;
 *     if (angular.isFunction(headers)) return headers(h);
 *     return angular.equals(headers, h);
 *   };
 *
 *   this.matchData = function(d) {
 *     if (angular.isUndefined(data)) return true;
 *     if (data && angular.isFunction(data.test)) return data.test(d);
 *     if (data && angular.isFunction(data)) return data(d);
 *     if (data && !angular.isString(data)) return angular.equals(data, angular.fromJson(d));
 *     return data == d;
 *   };
 *
 *   this.toString = function() {
 *     return method + ' ' + url;
 *   };
 * }
 */
export class MockHttpExpectation {
  constructor(method, url, data, headers) {
    this.method = method;
    this.url = url;
    this.data = data;
    this.headers = headers;
  }

  match(method, url, data, headers) {
    if (this.method != method) return false;
    if (!this.matchUrl(url)) return false;
    if (typeof data !== 'undefined' && !this.matchData(data)) return false;
    if (typeof headers !== 'undefined' && !this.matchHeaders(headers)) return false;
    return true;
  }

  matchUrl(url) {
    if (!this.url) return true;
    if (typeof this.url.test === 'function') return this.url.test(url);
    return this.url == url;
  }

  matchHeaders(headers) {
    if (typeof this.headers === 'undefined') return true;
    if (typeof this.headers === 'function') return this.headers(headers);

    return Utils.objectEquals(this.headers, headers);
  }

  matchData(data) {
    if (typeof this.data === 'undefined') return true;
    if (this.data && typeof this.data.test === 'function') return this.data.test(data);
    if (this.data && typeof this.data === 'function') return this.data(data);
    if (this.data && typeof this.data !== 'string') return Utils.objectEquals(this.data, JSON.parse(data));
    return this.data == data;
  }

  toString() {
    return this.method + ' ' + this.url;
  }
}