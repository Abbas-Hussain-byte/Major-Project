export class TranslationUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TranslationUnavailableError';
  }
}

export class ProviderNotConfiguredError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProviderNotConfiguredError';
  }
}
