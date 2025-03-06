import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly _HttpClient = inject(HttpClient)

  getAllRoles():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Roles/v1/GetAllRoles/GetAllRoles`)
  }

  addRole(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Roles/v1/AddRole/AddNewRole`, data)
  }

  DeleteRole(roleName:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Roles/v1/DeleteByName/DeleteRole/roleName?roleName=${roleName}`)
  }

}
