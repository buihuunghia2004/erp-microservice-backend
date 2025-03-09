import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ErrorDto } from '@/common/dto/error.dto';
import { ValidationException } from '@/exceptions/validation.exception';
import { UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ErrorCode } from '@/constants/error-code.constant';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    // Deserialize the ErrorDto from the RpcException
    const errorDto: ErrorDto = JSON.parse(exception.message);

    // Convert ErrorDto back to appropriate HttpException
    const httpException = this.convertToHttpException(errorDto);

    // Use the existing GlobalExceptionFilter logic to format the response
    const globalFilter = new GlobalExceptionFilter();
    globalFilter.catch(httpException, host);
  }

  private convertToHttpException(errorDto: ErrorDto): HttpException {
    switch (errorDto.statusCode) {
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return new UnprocessableEntityException({
          message: errorDto.details || errorDto.message,
        });
      case HttpStatus.BAD_REQUEST:
        if (errorDto.errorCode) {
          return new ValidationException(errorDto.message as ErrorCode, errorDto.errorCode as ErrorCode);
        }
        return new HttpException(errorDto.message, errorDto.statusCode);
      case HttpStatus.NOT_FOUND:
      case HttpStatus.CONFLICT:
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return new HttpException(errorDto.message, errorDto.statusCode);
      default:
        return new HttpException(
          errorDto.message || 'An unexpected error occurred',
          errorDto.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}