import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../assets/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly _HttpClient = inject(HttpClient)

  // GetAllCars(pageNum:any = 1, pageSize:any = 10):Observable<any>{
  //   return this._HttpClient.get(`${environment.baseURL}api/Car/v1/GetAll/GetAllCars??pageNumber=${pageNum}&pageSize=${pageSize}`)
  // }
  GetAllCars(branchId:any, pageNum:any = 1, pageSize:any = 10):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Car/v1/GetCarsInBranch/GetCarsInBranch/${branchId}?pageNumber=${pageNum}&pageSize=${pageSize}`)
  }

  GetCarById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Car/v1/GetById/GetCarById/${id}`)
  }

  CreateCar(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Car/v1/Create/CreateCar`, data)
  }

  UpdateCar(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Car/v1/Update/UpdateCar`, data)
  }

  DeleteCar(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Car/v1/Delete/DeleteCar/${id}`)
  }

  // Upload Excel File
  ImportCars(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Car/v1/ImportCars/import`, data)
  }
}
