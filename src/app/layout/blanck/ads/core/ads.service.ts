import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private readonly _HttpClient = inject(HttpClient)

  GetAllAds():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Advertiesment/v1/GetAll/GetAll`)
  }

  CreateNewAds(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Advertiesment/v1/Create/CreateNewAds`, data)
  }

  EditAds(data:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Advertiesment/v1/Edit/EditAds`, data)
  }

  SoftDeleteAds(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Advertiesment/v1/SoftDelete/SoftDelete/${id}`)
  }

  HardDeleteAds(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Advertiesment/v1/HardDelete/HardDelete/${id}`)
  }
}
