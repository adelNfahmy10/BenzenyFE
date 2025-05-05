import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly _HttpClient = inject(HttpClient)

  GetAllCompanies(searchTerm:any = '', pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Company/v1/GetAll/GetAllCompanies?searchTerm=${searchTerm}&pageNumber=${pageNum}&pageSize=${pageSize}`)
  }

  GetCompanyById(companyId:string | null):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Company/v1/GetById/${companyId}`)
  }

  CreateCompany(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Company/v1/Create/CreateCompany`, data)
  }

  UpdateCompany(companyId:string, data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Company/v1/Update/UpdateCompany/${companyId}`, data)
  }

  DeleteCompany(companyId:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Company/v1/DeleteCompany/DeleteCompany/${companyId}`)
  }

  /*########################################### Users APIs #########################################################*/
  GetAllUserInCompanyById(companyId:string, searchTerm:any = '', pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Company/v1/GetAllUserInCompany/GetAllUserInCompany/${companyId}?searchTerm=${searchTerm}&pageNumber=${pageNum}&pageSize=${pageSize}`)
  }
  DeleteUserInCompany(companyId:string, userId:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Company/v1/DeleteUserInCompany/DeleteUserInCompany/${companyId}/${userId}`)
  }
}
