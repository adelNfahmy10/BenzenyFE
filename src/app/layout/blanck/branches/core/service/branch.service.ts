import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private readonly _HttpClient = inject(HttpClient)

  GetAllBranchs():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Branch/v1/GetAllBranchs`)
  }

  // GetBranchById():Observable<any>{
  //   return this._HttpClient.get(`${environment.baseURL}api/Branch/v1/GetAllBranchs`)
  // }

  CreateBranch(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Branch/v1/CreateBranch/CreateBranch`, data)
  }

}
