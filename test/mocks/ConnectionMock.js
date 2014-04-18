import {$ConnectionFactory} from '../../src/XHRConnection';
import {Deferred} from 'deferred/Deferred';
import {IConnection} from '../../src/IConnection';
import {Provide} from 'di/annotations';
import {PromiseBackend} from 'deferred/PromiseMock';

export class ResponseMap extends Map {
  constructor() {
    super();
    this.set('body', null);
    this.set('code', null);
  }

  respond(code:number, body:string) {
    this.set('code', code);
    this.set('body', body);
  }
}

export class ConnectionMockBackend {
  static flush() {
    var responses, connections;
    responses = ConnectionMockBackend.requestResponseMap;
    connections = ConnectionMockBackend.connections;
    if (!responses) {
      throw new ReferenceError('There are no responses to fulfill');
    }

    if (!connections || !connections.length) {
      throw new ReferenceError('There are no connections to resolve');
    }

    connections.forEach(function(connection) {
      if (!connection.sent_) {
        return;
      }
      if (responses.has(connection.method) &&
          responses.get(connection.method).has(connection.url)) {
        connection.deferred.resolve(responses.get(connection.method).
            get(connection.url).
            get('body'));
      }
    });

    new PromiseBackend().flush(true);
  }

  static whenRequest(method:string, url:string) {
    if (!ConnectionMockBackend.requestResponseMap) {
      ConnectionMockBackend.requestResponseMap = new Map();
    }
    if (!ConnectionMockBackend.requestResponseMap.has(method)) {
      ConnectionMockBackend.requestResponseMap.set(method, new Map());
    }

    var responseMap = new ResponseMap();
    ConnectionMockBackend.requestResponseMap.get(method).set(url, responseMap);
    return responseMap;
  }

  static addConnection(connection) {
    if (!ConnectionMockBackend.connections) {
      ConnectionMockBackend.connections = [];
    }
    ConnectionMockBackend.connections.push(connection);
  }

  static forkZone() {
    return new PromiseBackend().forkZone();
  }
}

export class ConnectionMock {
  constructor() {
    this.backend = new ConnectionMockBackend();
    this.deferred = new Deferred();
    ConnectionMockBackend.addConnection(this);
  }

  send() {
    this.sent_ = true;
  }

  open(method:string, url:string) {
    this.method = method;
    this.url = url;
  }

  then(success, error) {
    this.deferred.promise.then.call(this.deferred.promise, success, error);
  }

  success() {

  }

  error() {

  }


}

@Provide($ConnectionFactory)
export class ConnectionMockFactory {
  constructor() {
    return ConnectionMock;
  }
}