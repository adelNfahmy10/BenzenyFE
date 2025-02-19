import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../app/layout/auth/core/service/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const _AuthService = inject(AuthService)
  let token = localStorage.getItem('token')
  let refreshToken = localStorage.getItem('refreshToken')

  if(token) {
    req = req.clone({
      setHeaders: {Authorization: `Bearer ${token!}`}
    })
  }
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 || err.error?.msg === "Unauthorized") {
        let data = {
          accessToken: token!,
          refreshToken: refreshToken!
        };

        return _AuthService.refreshToken(data).pipe(
          switchMap((res: any) => {
            if (res && res.data) {
              // تحديث التوكنات في localStorage
              let newToken = localStorage.setItem('token', res.data.accessToken);

              const updatedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });

              // إرسال الطلب مع التوكن الجديد
              return next(updatedReq);
            } else {
              // إذا لم يتم تجديد التوكن بشكل صحيح
              return throwError(() => new Error('Unable to refresh token.'));
            }
          }),
          catchError((refreshErr) => {
            // التعامل مع الخطأ في عملية تجديد التوكن
            console.error('Token refresh failed', refreshErr);
            return throwError(() => new Error('Token refresh failed.'));
          })
        );
      } else {
        // إذا كان الخطأ مختلفًا، قم بإرجاعه كما هو
        return throwError(() => err);
      }
    })
  );


  // return next(req).pipe(catchError( (err)=>{
  //   if(err.status === 401){
  //     let formData = new FormData();
  //     formData.append("AccessToken", token!);
  //     formData.append("RefreshToken", refreshToken!);

  //     _AuthService.RefreshToken(formData).pipe(switchMap((res:any)=>{
  //         localStorage.removeItem('user');
  //         localStorage.removeItem('refreshToken');
  //         localStorage.setItem('user', res.data.accessToken)
  //         localStorage.setItem('refreshToken', res.data.refreshToken)
  //         const updatedReq = req.clone({
  //           setHeaders: { Authorization: localStorage.getItem('user')! },
  //         });
  //         return next(updatedReq);
  //     }),
  //     catchError((refreshErr) => {
  //       localStorage.removeItem('user');
  //       localStorage.removeItem('refreshToken');
  //       _Router.navigate(['/login']);
  //       return throwError(refreshErr);
  //     })
  //     );
  //   }
  //   return throwError({err})
  // }));




};
