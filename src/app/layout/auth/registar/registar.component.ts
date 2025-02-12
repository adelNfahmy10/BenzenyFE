import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgFor } from '@angular/common';
import { CompanyService } from '../../blanck/companies/core/service/company.service';

@Component({
  selector: 'app-registar',
  standalone: true,
  imports: [ReactiveFormsModule, NgxDropzoneModule, NgFor,FormsModule],
  templateUrl: './registar.component.html',
  styleUrl: './registar.component.scss'
})
export class RegistarComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CompanyService = inject(CompanyService)
  private readonly _Router = inject(Router)

  step:number = 1
  files: File[] = [];

  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
    console.log(this.files);
  }

  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  registerForm:FormGroup = this._FormBuilder.group({
    Name: [''],
    Description: [''],
    CompanyEmail: [''],
    CompanyPhone: [''],
    Files: [''],
  })
  companyId:string = ''
  submitRegisterForm():void{
    let data = this.registerForm.value
    data.Files = this.files
    let formData = new FormData()
    formData.append('Name', data.Name)
    formData.append('Description', data.Description)
    formData.append('CompanyEmail', data.CompanyEmail)
    formData.append('CompanyPhone', data.CompanyPhone)
    formData.append('Files', data.Files)
    this.step = 2
    this.getCompanyById()

    // this._CompanyService.CreateCompany(formData).subscribe({
    //   next:(res)=>{
    //     console.log(res);
    //     this.companyId = res.data.id
    //     this.step = 2
    //     this.getCompanyById()
    //   }
    // })
  }

  companyData!:any
  userName:string = ''
  password:string = ''

  getCompanyById():void{
    this._CompanyService.GetCompanyById('727eddb5-d6de-4b53-a1ee-08dd4b57862b').subscribe({
      next:(res)=>{
        this.companyData = res
        console.log(this.companyData);
      }
    })
  }
  continueData():void{
    let data = {...this.companyData}
    data.UserName = this.userName
    data.UserName = this.password
    console.log(data);
    this._Router.navigate(['/home'])
  }
}
