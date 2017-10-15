import ExtendableError from 'es6-error';

export class RequestCanceledError extends ExtendableError {
  constructor() {
    super('Request canceled');
  }
}

export class LoadListError extends ExtendableError {
  constructor(errors) {
    super('List loading failed');
    this.errors = errors;
  }
}
