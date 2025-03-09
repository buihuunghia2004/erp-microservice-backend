import { RpcException } from '@nestjs/microservices';
import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { ErrorDto } from '@/common/dto/error.dto';
import { ValidationException } from '@/exceptions/validation.exception';
import { UnprocessableEntityException, HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { ErrorCode } from '@/constants/error-code.constant';
import { STATUS_CODES } from 'http';
import { ErrorDetailDto } from '@/common/dto/error-detail.dto';
import { constraintErrors } from '@/constants/constraint-errors';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Catch()
export class RpcGlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcGlobalExceptionFilter.name);
  private i18n: I18nContext<I18nTranslations>;

  constructor() {}

  catch(exception: any, host: ArgumentsHost): void {
    const error = this.processException(exception);
    // Throw RpcException with serialized ErrorDto
    throw new RpcException(JSON.stringify(error));
  }

  private processException(exception: any): ErrorDto {
    if (exception instanceof UnprocessableEntityException) {
      return this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof ValidationException) {
      return this.handleValidationException(exception);
    } else if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      return this.handleQueryFailedError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      return this.handleEntityNotFoundError(exception);
    } else {
      return this.handleError(exception);
    }
  }

  // Reuse the existing handlers from your GlobalExceptionFilter
  private handleUnprocessableEntityException(exception: UnprocessableEntityException): ErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();
    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: 'Validation failed',
      details: this.extractValidationErrorDetails(r.message),
    };
  }

  /**
     * Handles validation errors
     * @param exception ValidationException
     * @returns ErrorDto
     */
  private handleValidationException(exception: ValidationException): ErrorDto {
    const r = exception.getResponse() as {
      errorCode: ErrorCode;
      message: string;
    };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      errorCode:
        Object.keys(ErrorCode)[Object.values(ErrorCode).indexOf(r.errorCode)],
      message:
        r.message
    };

    this.logger.debug(exception);

    return errorRes;
  }

  // Add other handlers (handleValidationException, handleHttpException, etc.) similarly...

  /**
   * Handles HttpException
   * @param exception HttpException
   * @returns ErrorDto
   */
  private handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: exception.message,
    };

    this.logger.debug(exception);

    return errorRes;
  }

  
  /**
   * Handles EntityNotFoundError when using findOrFail() or findOneOrFail() from TypeORM
   * @param error EntityNotFoundError
   * @returns ErrorDto
   */
  private handleEntityNotFoundError(error: EntityNotFoundError): ErrorDto {
    const status = HttpStatus.NOT_FOUND;
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status],
      message: this.i18n.t('common.error.entity_not_found'),
    } as unknown as ErrorDto;

    this.logger.debug(error);

    return errorRes;
  }

  /**
     * Handles QueryFailedError
     * @param error QueryFailedError
     * @returns ErrorDto
     */
    private handleQueryFailedError(error: QueryFailedError): ErrorDto {
      const r = error as QueryFailedError & { constraint?: string };
      const { status, message } = r.constraint?.startsWith('UQ')
        ? {
            status: HttpStatus.CONFLICT,
            message: r.constraint
              ? this.i18n.t(
                  (constraintErrors[r.constraint] ||
                    r.constraint) as keyof I18nTranslations,
                )
              : undefined,
          }
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: this.i18n.t('common.error.internal_server_error'),
          };
      const errorRes = {
        timestamp: new Date().toISOString(),
        statusCode: status,
        error: STATUS_CODES[status],
        message,
      } as unknown as ErrorDto;
  
      this.logger.error(error);
  
      return errorRes;
    }

  private handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    return {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error?.message || 'An unexpected error occurred',
    };
  }

  /**
     * Extracts error details from ValidationError[]
     * @param errors ValidationError[]
     * @returns ErrorDetailDto[]
     */
    private extractValidationErrorDetails(
      errors: ValidationError[],
    ): ErrorDetailDto[] {
      const extractErrors = (
        error: ValidationError,
        parentProperty: string = '',
      ): ErrorDetailDto[] => {
        const propertyPath = parentProperty
          ? `${parentProperty}.${error.property}`
          : error.property;
  
        const currentErrors: ErrorDetailDto[] = Object.entries(
          error.constraints || {},
        ).map(([code, message]) => ({
          property: propertyPath,
          code,
          message,
        }));
  
        const childErrors: ErrorDetailDto[] =
          error.children?.flatMap((childError) =>
            extractErrors(childError, propertyPath),
          ) || [];
  
        return [...currentErrors, ...childErrors];
      };
  
      return errors.flatMap((error) => extractErrors(error));
    }
}