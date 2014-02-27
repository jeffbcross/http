import {HttpBackend} from '../src/httpBackend';
import {Injector} from '../node_modules/di/src/injector';
import {Inject, Provide, SuperConstructor} from '../node_modules/di/src/annotations';
import {Something} from '../src/httpBackend';
import {$MockWindow} from './mocks/Window';

describe('HttpBackend', function () {
  it('should construct', function () {
    var injector = new Injector([$MockWindow, HttpBackend]);
    var httpBackend = injector.get(HttpBackend);
    expect(httpBackend).toBeInstanceOf(HttpBackend);
    expect(new HttpBackend(injector.get($MockWindow))).toBeInstanceOf(HttpBackend);
  });
});
