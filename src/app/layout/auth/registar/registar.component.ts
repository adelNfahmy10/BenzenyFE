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
    console.log(data);

    this._CompanyService.CreateCompany(formData).subscribe({
      next:(res)=>{
        console.log(res);
        this.companyId = res.data.id
        this.step = 2
        this.getCompanyById(this.companyId)
      }
    })
  }


  complateForm:FormGroup = this._FormBuilder.group({
    Username:[''],
    FullName:[''],
    Email:[''],
    Mobile:[''],
    Password :['']
  })
  companyData!:any


  getCompanyById(companyId:string):void{
    if(this.step == 2){
      this._CompanyService.GetCompanyById(companyId).subscribe({
        next:(res)=>{
          this.companyData = res
        }
      })
    }
  }
  continueData():void{
    let oldData = this.companyData.data
    let newData = this.complateForm.value
    let data = {
      ...oldData,
      ...newData
    }

    let formData = new FormData
    formData.append('Id', data.id),
    formData.append('Name', data.name),
    formData.append('Description', data.description),
    formData.append('CompanyEmail', data.companyEmail),
    formData.append('CompanyPhone', data.companyPhone),
    formData.append('Username', data.Username),
    formData.append('FullName', data.FullName),
    formData.append('Email', data.Email),
    formData.append('Mobile', data.Mobile),
    formData.append('Password', data.Password)

    this._CompanyService.UpdateCompany(data.id ,formData).subscribe({
      next:(res)=>{
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refresh)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('userName', res.data.fullname)
        localStorage.setItem('companyId', res.data.id)
        localStorage.setItem('companyName', res.data.name)
        this._Router.navigate(['/home'])
      }
    })
  }
}
