/**
 * Formerly createResponse()
 *  function createResponse(status, data, headers) {
 *    if (angular.isFunction(status)) return status;
 *
 *    return function() {
 *      return angular.isNumber(status)
 *          ? [status, data, headers]
 *          : [200, status, data];
 *    };
 *  }
 */
export class MockHttpResponse extends Array {
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

