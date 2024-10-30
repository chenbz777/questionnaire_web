export default class VerifyModel {

  #materielFactory;
  #messagePrefix = '';
  #messageSuffix = '';

  constructor(materielFactory) {
    this.#materielFactory = materielFactory;

    this.key = this.#materielFactory.key;
    this.message = this.getMessage();
    this.status = 'success';
  }

  getMessage(message = '') {
    return `${this.#materielFactory?.props?.title}: ${message}`;
  }

  error(message) {
    this.message = this.getMessage(message);
    this.status = 'error';

    return this;
  }

  unverified(message) {
    this.message = this.getMessage(message);
    this.status = 'unverified';

    return this;
  }

  success(message) {
    this.message = this.getMessage(message);
    this.status = 'success';

    return this;
  }
}