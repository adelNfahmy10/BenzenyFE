import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../app/layout/auth/core/service/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const _AuthService = inject(AuthService)
  let token = localStorage.getItem('token')
  let refreshToken = localStorage.getItem('refreshToken')

  if(token !== null){
    if(token) {
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${token!}`}
      })
    }
  }

  return next(req).pipe(
    catchError((err) => {
      if (token !== null && err.status === 401 || err.error?.msg === "Unauthorized") {
        let data = {
          accessToken: token!,
          refreshToken: refreshToken!
        };
        return _AuthService.refreshToken(data).pipe(
          switchMap((res: any) => {
            if (res && res.data) {
              localStorage.setItem('token', res.data.accessToken);

              const updatedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.data.accessToken}` },
              });

              return next(updatedReq);
            } else {
              return throwError(() => new Error('Unable to refresh token.'));
            }
          }),
          catchError((refreshErr) => {
            return throwError(() => new Error('Token refresh failed.'));
          })
        );
      } else {
        return throwError(() => err);
      }
    })
  );
};
