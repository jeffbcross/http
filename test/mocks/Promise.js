export class $MockPromise {
  constructor (mockresolver) {
    this.resolves = [];
    this.rejects = [];
    this.state_ = 'pending';
    mockresolver.call(this, this.resolve, this.reject);
  }

  then (good, bad) {
    this.resolves.push(good);
    this.rejects.push(bad);
  }

  resolve (val) {
    this.state_ = 'fulfilled';
    this.value = val;
  }

  reject (val) {
    this.state_ = 'rejected';
    this.value = val;
  }

  flush () {
    if (this.state_ === 'rejected') {
      this.rejects.forEach(function(callback) {
        callback.call(this.value);
      }.bind(this));
    }
    else if (this.state_ === 'fulfilled') {
      this.resolves.forEach(function(callback) {
        callback.call(this.value);
      }.bind(this));
    }
    else {
      throw new Error('No pending promises to flush!');
    }
  }
}
