import {$HttpBackend} from '../src/HttpBackend';
import {Injector} from '../node_modules/di/src/injector';
import {$MockWindow} from './mocks/Window';
import {use, inject} from '../node_modules/di/src/testing';

describe('$HttpBackend', function () {
  it('should construct', function () {
    var injector = new Injector([$MockWindow, $HttpBackend]);
    var httpBackend = injector.get($HttpBackend);
    expect(httpBackend).toBeInstanceOf($HttpBackend);
  });
});
