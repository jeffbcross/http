/**
 * @param {String|Object} data
 */
export class $RequestData {
  constructor (data) {
    this.data = data;
  }

  serialize () {
    if (this.data instanceof Object) {
      return JSON.stringify(this.data);
    }
    else {
      return this.data;
    }
  }
}