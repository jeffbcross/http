import {Injector} from '../node_modules/di/src/injector';
import {Inject, Provide, SuperConstructor} from '../node_modules/di/src/annotations';
import {$Window} from '../src/Window';

@Inject($Window)
class HttpBackend {
  constructor($window) {
    this.xhr = new $window.XMLHttpRequest();
  }

  open(method, url) {
    this.xhr.open(method, url);
  }
}

export {HttpBackend};
