import { Component, inject } from '@angular/core';
import { SettingService } from '../core/services/setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BtnupdateComponent } from "../../../../../assets/share/buttons/btnupdate/btnupdate.component";
import { BtnaddComponent } from "../../../../../assets/share/buttons/btnadd/btnadd.component";

@Component({
  selector: 'app-cartype',
  standalone: true,
  imports: [BtnupdateComponent, BtnaddComponent, ReactiveFormsModule],
  templateUrl: './cartype.component.html',
  styleUrl: './cartype.component.scss'
})
export class CartypeComponent {
 private readonly _SettingService = inject(SettingService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)

  allCarType:any[] = []
  update:boolean = false
  updateData:any

  ngOnInit(): void {
    this.getAllCarType()
  }

  getAllCarType():void{
    this._SettingService.GetAllCarTypes().subscribe({
      next:(res)=>{
        this.allCarType = res.data
      }
    })
  }

  carTypeForm:FormGroup = this._FormBuilder.group({
    title:['']
  })

  submitCarTypeForm():void{
    let data = this.carTypeForm.value
    this._SettingService.CreateCarTypes(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Car Type Added Successfully');
        this.carTypeForm.reset()
        this.getAllCarType()
      }
    })
  }

  deleteCarType(id:any):void{
    this._SettingService.DeleteCarTypes(id).subscribe({
      next:(res)=>{
        this._ToastrService.success('Car Type Deleted Successfully');
        this.getAllCarType()
      }
    })
  }

  patchCarType(data:any):void{
    this.updateData = data
    this.update = true
    this.carTypeForm.patchValue({
      title: data.title
    })
  }

  updateCarType():void{
    let data = this.carTypeForm.value
    data.id = this.updateData.id

    this._SettingService.UpdateCarTypes(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Car Type Updated Successfully');
        this.getAllCarType()
        this.carTypeForm.reset()
        this.update = false
      }
    })
  }
}
