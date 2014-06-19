import {serialize, deserialize} from '../src/Serialize';

describe('serialize()', function() {
  it('should stringify objects', function() {
    expect(serialize({name: 'Jeff'})).toBe('{"name":"Jeff"}');
  });


  it('should return the data as is if already a string', function() {
    expect(serialize('{"name":"Jeff"}')).toBe('{"name":"Jeff"}');
  });


  it('should return an empty string for undefined input', function() {
    expect(serialize(undefined)).toBe('');
  });
});
