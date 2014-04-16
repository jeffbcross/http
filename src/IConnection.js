import {assert} from 'assert';

var IConnection = assert.define('IConnection', function(Connection) {
  assert(Connection.prototype).is(assert.structure({
    open: Function,
    send: Function,
    then: Function,
    success: Function,
    error: Function
  }));
});

export {IConnection};
