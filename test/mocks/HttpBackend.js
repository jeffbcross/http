import {$HttpBackend} from '../../src/HttpBackend';
import {$Http} from '../../src/ngHttp';
import {Inject, Provide} from '../../node_modules/di/src/annotations';

@Provide($HttpBackend)
class $MockHttpBackend {
  constructor () {
    this.outStandingRequests = [];
    this.outStandingExpectations = [];
  }

  expect (method, url, data) {
    var req, length = this.outStandingRequests.length;
    this.outStandingRequests.push({
      method: method,
      url: url,
      data: data
    });
    req = this.outStandingRequests[length];
    return {
      respond: function (res) {
        req.response = res;
      }
    };
  }

  respond (res) {
    this.outStandingRequests[this.outStandingRequests.length - 1].response = res;
  }

  request ($http: $Http) {
    var req;

    for (var i = 0; i < this.outStandingRequests.length; i++) {
      req = this.outStandingRequests[i];

      if (req.method === $http.method &&
          req.url === $http.fullUrl() &&
          req.data === $http.data) {
        this.outStandingRequests.splice(i, 1);
        break;
      }
    }
  }

  verifyNoOutstandingExpectation () {
    if (this.outStandingRequests.length) {
      throw new Error('Requests waiting to be flushed');
    }
  }

  verifyNoOutstandingRequest () {
    if (this.outStandingExpectations.length) {
      throw new Error('Expectations waiting to be met');
    }
  }
}

export {$MockHttpBackend};
