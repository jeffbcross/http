import {Provide} from '../../node_modules/di/src/annotations';
import {$Window} from '../../src/Window';

@Provide($Window)
class $MockWindow {
  constructor() {
    this.XMLHttpRequest = function () {};
  }
}

export {$MockWindow};
