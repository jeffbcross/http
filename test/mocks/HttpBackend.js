import {$HttpBackend} from '../../src/HttpBackend';
import {$Http, $Connection} from '../../src/ngHttp';
import {Inject, Provide} from '../../node_modules/di/src/annotations';

@Provide($HttpBackend)
export class $MockHttpBackend {
  constructor () {
    this.outStandingRequests = [];
    this.outStandingFlush = [];
    this.expectations = [];
  }

  expect (method, url, data, headers) {
    var expectation = new MockHttpExpectation(method, url, data, headers);
    this.expectations.push(expectation);

    return {
      respond: function (status, data, headers) {
        expectation.response = new MockResponse(status, data, headers);
      }
    };
  }

  flush () {
    var i, flushTuple;
    for (i = 0; i < this.outStandingFlush.length; i++) {
      flushTuple = this.outStandingFlush[i];

      if (typeof flushTuple.connection.onSuccess === 'function') {
        flushTuple.connection.onSuccess.call(flushTuple.connection, flushTuple.response)
        this.outStandingFlush.splice(i, 1);
      }
    }
  }

  addToFlush (connection, response) {
    this.outStandingFlush.push({
      connection: connection,
      response: response
    });
  }

  respond (res) {
    this.outStandingRequests[this.outStandingRequests.length - 1].response = res;
  }

  request (connection: $Connection) {
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

  verifyNoOutstandingExpectation () {
    this.outStandingRequests.forEach(function (req) {
      if (req.onSuccess || req.onError) {
        throw new Error('Requests waiting to be flushed');
      }
    });
  }

  verifyNoOutstandingRequest () {
    if (this.outStandingFlush.length) {
      throw new Error('Expectations waiting to be met');
    }
  }
}

class MockHttpExpectation {
  constructor(method, url, data, headers) {
    this.method = method;
    this.url = url;
    this.data = data;
    this.headers = headers;
  }
}

class MockResponse extends Array {
  constructor(status, data, headers) {
    if (typeof status === 'function') {
      this.splice(0, 0, status);
    }
    else if (typeof status === 'number') {
      this.splice(0, 0, [status, data, headers]);
    }
    else {
      this.splice(0, 0, [200, status, data])
    }
  }
}
