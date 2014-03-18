import {$HttpBackend} from '../../src/HttpBackend';
import {$Connection} from '../../src/Connection';
import {$Http, $Connection} from '../../src/ngHttp';
import {Inject, Provide} from 'di/annotations';
import {MockXhr} from './Xhr';
import {MockHttpExpectation} from './HttpExpectation';
import {MockHttpResponse} from './HttpResponse';

@Provide($HttpBackend)
export class $MockHttpBackend {
  constructor() {
    this.definitions = [];
    this.expectations = [];
    this.responses = [];

    this.xhr = new MockXhr();

    this.outStandingRequests = [];
    this.outStandingFlush = [];
  }

  expect(method, url, data, headers) {
    var expectation = new MockHttpExpectation(method, url, data, headers);
    this.expectations.push(expectation);

    return {
      respond: function(status, data, headers) {
        expectation.response = new MockHttpResponse(status, data, headers);
        this.responses.push(expectation);
      }.bind(this)
    };
  }

  respond(res) {
    this.outStandingRequests[this.outStandingRequests.length - 1].response = res;
  }

  request(connection) {
    var req;

    for (var i = 0; i < this.outStandingRequests.length; i++) {
      req = this.outStandingRequests[i];
      if (req.method === connection.method &&
          req.url === connection.fullUrl() &&
          req.data === connection.data) {


        if (connection.onSuccess) {
          this.addToFlush(connection, req.response);
        }
        this.outStandingRequests.splice(i, 1);
        break;
      }
    }
  }

  verifyNoOutstandingExpectation() {
    this.outStandingRequests.forEach(function(req) {
      if (req.onSuccess || req.onError) {
        throw new Error('Requests waiting to be flushed');
      }
    });
  }

  verifyNoOutstandingRequest() {
    if (this.outStandingFlush.length) {
      throw new Error('Expectations waiting to be met');
    }
  }
}

