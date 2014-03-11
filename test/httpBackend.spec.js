import {$HttpBackend} from '../src/HttpBackend';
import {Injector} from '../node_modules/di/src/injector';
import {$MockWindow} from './mocks/Window';
import {use, inject} from '../node_modules/di/src/testing';

describe('$HttpBackend', function () {
  var $httpBackend;

  beforeEach(function () {
    use($MockWindow);
  });

  beforeEach(inject($HttpBackend, function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;
  }));

  it('should construct', function () {
    expect($httpBackend).toBeInstanceOf($HttpBackend);
  });
});
