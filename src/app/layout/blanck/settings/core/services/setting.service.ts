import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../assets/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private readonly _HttpClient = inject(HttpClient)

  /* Start Car Brand */
  getAllCarBrand():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Settings/GetAllCarBrands`)
  }

  CreateCarBrand(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Settings/CreateCarBrands`, data)
  }

  UpdateCarBrand(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Settings/UpdateCarBrands`, data)
  }

  DeleteCarBrand(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Settings/DeleteCarBrands/${id}`)
  }
  /* End Car Brand */


  /* Start Car Model */
  GetAllCarModels():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Settings/GetAllCarModels`)
  }

  CreateCarModels(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Settings/CreateCarModels`, data)
  }

  UpdateCarModels(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Settings/UpdateCarModels`, data)
  }

  DeleteCarModel(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Settings/DeleteCarModel/${id}`)
  }
  /* End Car Model */

  /* Start Plate Type */
  GetAllPlateTypes():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Settings/GetAllPlateTypes`)
  }

  CreatePlateTypes(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Settings/CreatePlateTypes`, data)
  }

  UpdatePlateTypes(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Settings/UpdatePlateTypes`, data)
  }

  DeletePlateTypes(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Settings/DeletePlateTypes/${id}`)
  }
  /* End Plate Type */

  /* Start Car Type */
  GetAllCarTypes():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Settings/GetAllCarTypes`)
  }

  CreateCarTypes(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Settings/CreateCarTypes`, data)
  }

  UpdateCarTypes(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Settings/UpdateCarTypes`, data)
  }

  DeleteCarTypes(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Settings/DeleteCarTypes/${id}`)
  }
  /* End Car Type */

  /* Start Tags */
  GetAllTags():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}api/Settings/GetAllTags`)
  }

  CreateTags(data:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}api/Settings/CreateTags`, data)
  }

  UpdateTags(data:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}api/Settings/UpdateTags`, data)
  }

  DeleteTags(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}api/Settings/DeleteTags/${id}`)
  }
  /* End Tags */

}
