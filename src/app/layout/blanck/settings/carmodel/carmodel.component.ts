import { Component, inject } from '@angular/core';
import { SettingService } from '../core/services/setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BtnupdateComponent } from "../../../../../assets/share/buttons/btnupdate/btnupdate.component";
import { BtnaddComponent } from "../../../../../assets/share/buttons/btnadd/btnadd.component";

@Component({
  selector: 'app-carmodel',
  standalone: true,
  imports: [BtnupdateComponent, BtnaddComponent, ReactiveFormsModule],
  templateUrl: './carmodel.component.html',
  styleUrl: './carmodel.component.scss'
})
export class CarmodelComponent {
  private readonly _SettingService = inject(SettingService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)

  allCarModel:any[] = []
  update:boolean = false
  updateData:any

  ngOnInit(): void {
    this.getAllCarModel()
  }

  getAllCarModel():void{
    this._SettingService.GetAllCarModels().subscribe({
      next:(res)=>{
        this.allCarModel = res.data
      }
    })
  }

  carModelForm:FormGroup = this._FormBuilder.group({
    title:['']
  })

  submitCarModelForm():void{
    let data = this.carModelForm.value
    this._SettingService.CreateCarModels(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Model Added Successfully');
        this.carModelForm.reset()
        this.getAllCarModel()
      }
    })
  }

  deleteCarModel(id:any):void{
    this._SettingService.DeleteCarModel(id).subscribe({
      next:(res)=>{
        this._ToastrService.success('Model Deleted Successfully');
        this.getAllCarModel()
      }
    })
  }

  patchCarModel(data:any):void{
    this.updateData = data
    this.update = true
    this.carModelForm.patchValue({
      title: data.title
    })
  }

  updateCarModel():void{
    let data = this.carModelForm.value
    data.id = this.updateData.id

    this._SettingService.UpdateCarModels(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Model Updated Successfully');
        this.getAllCarModel()
        this.carModelForm.reset()
        this.update = false
      }
    })
  }
}
