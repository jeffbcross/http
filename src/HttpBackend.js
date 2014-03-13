import {Inject} from 'di/annotations';
import {$Window} from '../src/Window';

@Inject($Window)
class $HttpBackend {
  constructor($window) {
    this.xhr = new $window.XMLHttpRequest();
    this.$window_ = $window;
  }

  open(method, url) {
    this.xhr.open(method, url);
  }
}

export {$HttpBackend};
