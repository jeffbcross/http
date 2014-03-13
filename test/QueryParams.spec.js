import {$QueryParams} from '../src/QueryParams';

describe('$QueryParams', function() {
  describe('constructor', function() {
    it('should attach provided params to the instance', function() {
      var params = {userId: 1};
      expect(new $QueryParams(params).params).toBe(params);
    });
  });

  describe('.toQueryString()', function() {
    it('should do basic request with params and encode', function() {
      var queryParams = new $QueryParams({'a=':'?&', b:2});
      expect(queryParams.toQueryString()).toBe('?a%3D=%3F%26&b=2');
    });


    it('should merge params if url contains some already', function() {
      var queryParams = new $QueryParams({a:1, b:2});
      expect(queryParams.toQueryString(true)).toBe('&a=1&b=2');
    });


    it('should jsonify objects in params map', function() {
      var queryParams = new $QueryParams({a:1, b:{c:3}});
      expect(queryParams.toQueryString()).toBe('?a=1&b=%7B%22c%22:3%7D')
    });


    it('should expand arrays in params map', function() {
      var queryParams = new $QueryParams({a: [1,2,3]});
      expect(queryParams.toQueryString()).toBe('?a=1&a=2&a=3')
    });


    it('should not encode @ in url params', function() {
      var queryParams = new $QueryParams(
          {':bar': '$baz@1', '!do&h': 'g=a h'});
      expect(queryParams.toQueryString()).
          toBe('?!do%26h=g%3Da+h&:bar=$baz@1');
    });
  });


  describe('._encodeValue()', function() {
    it('should urlEncode value', function() {
      expect($QueryParams._encodeValue('http://%.com')).
          toBe('http:%2F%2F%25.com');
    });


    it('should create a key/value pair for each item in the array \
      (excluding the key from the first item)', function() {
        expect($QueryParams._encodeValue(['jeff','igor','tobias'], 'person')).
            toBe('jeff&person=igor&person=tobias');
    });


    it('should complain if given an array without an encodedKey', function() {
      expect(function () {
        $QueryParams._encodeValue(['jeff', 'igor', 'tobias']);
      }).
      toThrow(new Error('Missing 2nd argument: "encodedKey"'));
    });
  });
});
