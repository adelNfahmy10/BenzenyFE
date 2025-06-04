import { Component, inject } from '@angular/core';
import { SettingService } from '../core/services/setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BtnupdateComponent } from "../../../../../assets/share/buttons/btnupdate/btnupdate.component";
import { BtnaddComponent } from "../../../../../assets/share/buttons/btnadd/btnadd.component";

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [BtnupdateComponent, BtnaddComponent, ReactiveFormsModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
 private readonly _SettingService = inject(SettingService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)

  allTags:any[] = []
  update:boolean = false
  updateData:any

  ngOnInit(): void {
    this.getAllTags()
  }

  getAllTags():void{
    this._SettingService.GetAllTags().subscribe({
      next:(res)=>{
        this.allTags = res.data
      }
    })
  }

  tagForm:FormGroup = this._FormBuilder.group({
    title:['']
  })

  submitTagForm():void{
    let data = this.tagForm.value
    this._SettingService.CreateTags(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Tag Added Successfully');
        this.tagForm.reset()
        this.getAllTags()
      }
    })
  }

  deleteTag(id:any):void{
    this._SettingService.DeleteTags(id).subscribe({
      next:(res)=>{
        this._ToastrService.success('Tag Deleted Successfully');
        this.getAllTags()
      }
    })
  }

  patchTag(data:any):void{
    this.updateData = data
    this.update = true
    this.tagForm.patchValue({
      title: data.title
    })
  }

  updateTag():void{
    let data = this.tagForm.value
    data.id = this.updateData.id

    this._SettingService.UpdateTags(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Tag Updated Successfully');
        this.getAllTags()
        this.tagForm.reset()
        this.update = false
      }
    })
  }
}
