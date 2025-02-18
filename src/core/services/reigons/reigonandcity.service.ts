import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../assets/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReigonandcityService {
  private readonly _HttpClient = inject(HttpClient)


  /*################################### Regions APIS #############################################*/
  GetAllRegions(pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Region/v1/GetAllRegions/GetAllRegions?pageNumber=${pageNum}&pageSize=${pageSize}`)
  }

  GetRegionById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Region/v1/GetRegionById/GetRegionById/${id}`)
  }

  CreateRegion(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Region/v1/CreateRegion/CreateRegion`, data)
  }

  UpdateRegion(id:any, data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Region/v1/UpdateRegion/UpdateRegion?id=${id}`, data)
  }

  DeleteRegion(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Region/v1/DeleteRegion/DeleteRegion/${id}`)
  }

  /*################################### CITY APIS #############################################*/
  GetCityByRegionId(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/City/v1/GetByRegion/GetByRegion/${id}`)
  }

}
