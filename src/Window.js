class $Window {
  constructor () {
    this.XMLHttpRequest = window.XMLHttpRequest;
  }

  isFile (obj) {
    return obj instanceof File;
  }
}

export {$Window};
