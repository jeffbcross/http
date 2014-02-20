import {HttpBackend} from '../src/httpBackend';

describe('HttpBackend', function () {
  it('should construct', function () {
    expect(typeof new HttpBackend()).toBe('object');
  });
});
