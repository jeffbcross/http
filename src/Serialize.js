function serialize (data) {
  if (data instanceof Object) {
    return JSON.stringify(data);
  }
  else {
    return data;
  }
}

export {serialize};
