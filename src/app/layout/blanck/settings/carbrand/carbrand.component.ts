import { Component, inject, OnInit } from '@angular/core';
import { SettingService } from '../core/services/setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BtnaddComponent } from "../../../../../assets/share/buttons/btnadd/btnadd.component";
import { ToastrService } from 'ngx-toastr';
import { BtnupdateComponent } from "../../../../../assets/share/buttons/btnupdate/btnupdate.component";

@Component({
  selector: 'app-carbrand',
  standalone: true,
  imports: [ReactiveFormsModule, BtnaddComponent, BtnupdateComponent],
  templateUrl: './carbrand.component.html',
  styleUrl: './carbrand.component.scss'
})
export class CarbrandComponent implements OnInit{
  private readonly _SettingService = inject(SettingService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)

  allCarBrand:any[] = []
  update:boolean = false
  updateData:any

  ngOnInit(): void {
    this.getAllCarBrand()
  }

  getAllCarBrand():void{
    this._SettingService.getAllCarBrand().subscribe({
      next:(res)=>{
        this.allCarBrand = res.data
      }
    })
  }

  carBrandForm:FormGroup = this._FormBuilder.group({
    title:['']
  })

  submitCarBrandForm():void{
    let data = this.carBrandForm.value
    this._SettingService.CreateCarBrand(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Brand Added Successfully');
        this.carBrandForm.reset()
        this.getAllCarBrand()
      }
    })
  }

  deleteCarBrand(id:any):void{
    this._SettingService.DeleteCarBrand(id).subscribe({
      next:(res)=>{
        this._ToastrService.success('Brand Deleted Successfully');
        this.getAllCarBrand()
      }
    })
  }

  patchCarBrand(data:any):void{
    this.updateData = data
    this.update = true
    this.carBrandForm.patchValue({
      title: data.title
    })
  }

  updateCarBrand():void{
    let data = this.carBrandForm.value
    data.id = this.updateData.id

    this._SettingService.UpdateCarBrand(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Brand Updated Successfully');
        this.getAllCarBrand()
        this.carBrandForm.reset()
        this.update = false
      }
    })
  }
}
