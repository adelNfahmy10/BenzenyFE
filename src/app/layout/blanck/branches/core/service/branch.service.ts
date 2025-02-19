import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private readonly _HttpClient = inject(HttpClient)

  GetAllBranchs(pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Branch/v1/GetAllBranches/GetAllBranches?pageNumber=${pageNum}&pageSize=${pageSize}`)
  }

  GetBranchById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Branch/v1/GetBranchById?id=${id}`)
  }

  CreateBranch(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Branch/v1/CreateBranch/CreateBranch`, data)
  }

  UpdateBranch(id:any, data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Branch/v1/UpdateBranch/UpdateBranch?id=${id}`, data)
  }

  DeleteBranch(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Branch/v1/DeleteBranch/DeleteBranch?id=${id}`)
  }

  SwitchActive(id:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Branch/v1/SwitchActive/SwitchActive/${id}`,{})
  }
}
