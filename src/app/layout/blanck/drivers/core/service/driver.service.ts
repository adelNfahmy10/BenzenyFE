import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private readonly _HttpClient = inject(HttpClient)

  GetAllDrivers(pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Driver/v1/GetAllDrivers/GetAllDrivers?pageNumber=${pageNum}&pageSize=${pageSize}`)
  }

  GetDriverById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Driver/v1/GetDriverById/GetDriverById/${id}`)
  }

  CreateDriver(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Driver/v1/CreateDriver/CreateDriver`, data)
  }

  UpdateDriver(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Driver/v1/UpdateDriver/UpdateDriver`, data)
  }

  DeleteDriver(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Driver/v1/DeleteDriver/DeleteDriver/${id}`)
  }

  // Driver To Car APIs
  GetDriversInBranch(id:any, pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Driver/v1/GetDriversInBranch/GetDriversInBranch/${id}?pageNumber=${pageNum}&pageSize=${pageSize}`)
  }

  AssignDriverToCar(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Driver/v1/AssignDriverToCar/AssignDriverToCar`, data)
  }
  UnassignDriverFromCar(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Driver/v1/UnassignDriverFromCar/UnassignDriverFromCar`, data)
  }

  // Upload Excel File
  ImportDrivers(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Driver/v1/ImportDrivers/import`, data)
  }


}
