import {Provide} from 'di/annotations';
import {$Promise} from '../../src/Promise';

@Provide($Promise)
export class $MockPromise {
  constructor (mockresolver) {

  }
}
