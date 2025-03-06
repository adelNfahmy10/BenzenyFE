import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly _HttpClient = inject(HttpClient)
  addUser(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/UserManager/v1/Register/register`,data)
  }
  SwitchActiveUser(userId:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/UserManager/v1/SwitchUserActive/${userId}`, {})
  }
  updateUser(userId:any, data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/UserManager/v1/Update/Update?id=${userId}`,data)
  }
}
