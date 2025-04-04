export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: ErrorCode;

  constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    JOB_NOT_FOUND = 2001,
    INTERNAL_EXCEPTION = 3001
}