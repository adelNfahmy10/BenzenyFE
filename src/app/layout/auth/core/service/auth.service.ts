import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient)

  login(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Auth/v1/Login/login`,data)
  }

  register(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Auth/v1/Register/register`,data)
  }

  refreshToken(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Auth/v1/RefreshToken/refresh`,data)
  }


}
