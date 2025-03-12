import { HttpException } from "./root";

class NotFoundException extends HttpException {
  constructor(message: string, errors: any, errorCode: number) {
    super(message, errorCode, 404, null);
  }
}
