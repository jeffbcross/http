import {$HttpBackend} from '../src/HttpBackend';
import {Injector} from 'di/injector';
import {use, inject} from 'di/testing';

describe('$HttpBackend', function () {
  var $httpBackend;

  beforeEach(inject($HttpBackend, function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;
  }));

  it('should construct', function () {
    expect($httpBackend).toBeInstanceOf($HttpBackend);
  });
});
