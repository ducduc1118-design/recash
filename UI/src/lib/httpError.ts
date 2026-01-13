export interface HttpErrorShape {
  message: string;
  status?: number;
  details?: unknown;
}

export class HttpError extends Error {
  status?: number;
  details?: unknown;

  constructor({ message, status, details }: HttpErrorShape) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }

  get isNetworkError() {
    return this.status === undefined;
  }
}
