import {$ConnectionFactory} from '../../src/XHRConnection';
import {Provide} from 'di/annotations';

export class MockConnection {
  constructor() {

  }

  send() {

  }

  open() {

  }

  then() {

  }

  success() {

  }

  error() {

  }
}

@Provide($ConnectionFactory)
export class MockConnectionFactory {
  constructor() {
    return MockConnection;
  }
}