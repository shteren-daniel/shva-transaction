import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../services/error.service';



export const errorInterceptor: HttpInterceptorFn =
(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      const messages = mapError(error);

      errorService.setErrors(messages);

      return throwError(() => error);
    })
  );
};

function mapError(error: HttpErrorResponse): string[] {

  const validation = error?.error?.errors;

  if (validation) {

    return Object.values(validation)
      .flat()
      .map(String);
  }

  if (error?.error?.message) {
    return [error.error.message];
  }

  switch (error.status) {
    case 0:
      return ['אין חיבור לשרת'];

    case 400:
      return ['בקשה לא תקינה'];

    case 500:
      return ['שגיאת שרת'];

    default:
      return ['שגיאה לא צפויה'];
  }
}