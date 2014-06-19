function serialize (data) {
  if (data instanceof Object) {
    return JSON.stringify(data);
  }
  else if (data) {
    return data;
  }
  else {
    return '';
  }
}

export {serialize};
