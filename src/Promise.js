export class $Promise extends Promise {
  constructor (resolver) {
    return new Promise(resolver);
  }
}
