import { Component, inject } from '@angular/core';
import { BtnupdateComponent } from "../../../../../assets/share/buttons/btnupdate/btnupdate.component";
import { BtnaddComponent } from "../../../../../assets/share/buttons/btnadd/btnadd.component";
import { SettingService } from '../core/services/setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-platetype',
  standalone: true,
  imports: [BtnupdateComponent, BtnaddComponent, ReactiveFormsModule],
  templateUrl: './platetype.component.html',
  styleUrl: './platetype.component.scss'
})
export class PlatetypeComponent {
  private readonly _SettingService = inject(SettingService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)

  allPlateType:any[] = []
  update:boolean = false
  updateData:any

  ngOnInit(): void {
    this.getAllPlateType()
  }

  getAllPlateType():void{
    this._SettingService.GetAllPlateTypes().subscribe({
      next:(res)=>{
        this.allPlateType = res.data
      }
    })
  }

  plateTypeForm:FormGroup = this._FormBuilder.group({
    title:['']
  })

  submitPlateTypeForm():void{
    let data = this.plateTypeForm.value
    this._SettingService.CreatePlateTypes(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Plate Type Added Successfully');
        this.plateTypeForm.reset()
        this.getAllPlateType()
      }
    })
  }

  deletePlateType(id:any):void{
    this._SettingService.DeletePlateTypes(id).subscribe({
      next:(res)=>{
        this._ToastrService.success('Plate Type Deleted Successfully');
        this.getAllPlateType()
      }
    })
  }

  patchPlateType(data:any):void{
    this.updateData = data
    this.update = true
    this.plateTypeForm.patchValue({
      title: data.title
    })
  }

  updatePlateType():void{
    let data = this.plateTypeForm.value
    data.id = this.updateData.id

    this._SettingService.UpdatePlateTypes(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Plate Type Updated Successfully');
        this.getAllPlateType()
        this.plateTypeForm.reset()
        this.update = false
      }
    })
  }
}
