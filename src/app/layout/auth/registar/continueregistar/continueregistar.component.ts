import { Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../../../blanck/companies/core/service/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-continueregistar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './continueregistar.component.html',
  styleUrl: './continueregistar.component.scss'
})
export class ContinueregistarComponent implements OnInit{
  private readonly _CompanyService = inject(CompanyService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _Router = inject(Router)

  companyData!:any
  companyId!:any

  ngOnInit(): void {
    this.getCompanyById()
  }

  complateForm:FormGroup = this._FormBuilder.group({
    Username:[''],
    FullName:[''],
    Email:[''],
    Mobile:[''],
    Password :[''],
  })

  getCompanyById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.companyId = params.get('companyId')
        this._CompanyService.GetCompanyById(this.companyId).subscribe({
          next:(res)=>{
            this.companyData = res
          }
        })
      }
    })
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
