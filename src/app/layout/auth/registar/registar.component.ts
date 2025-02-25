import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgFor } from '@angular/common';
import { CompanyService } from '../../blanck/companies/core/service/company.service';
import Swal from 'sweetalert2';

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

  companyId:string = ''
  files: File[] = [];

  onSelect(event:any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  registerForm:FormGroup = this._FormBuilder.group({
    Name: [''],
    Description: [''],
    CompanyEmail: [''],
    CompanyPhone: [''],
    Files: [''],
  })
  submitRegisterForm():void{
    let data = this.registerForm.value
    data.Files = this.files
    let formData = new FormData()
    formData.append('Name', data.Name)
    formData.append('Description', data.Description)
    formData.append('CompanyEmail', data.CompanyEmail)
    formData.append('CompanyPhone', data.CompanyPhone)
    formData.append('Files', data.Files)

    this._CompanyService.CreateCompany(formData).subscribe({
      next:(res)=>{
        this.companyId = res.data.id
        Swal.fire({
          title: 'Thank you for joining',
          text: 'Please wait until we send you an email to complete your details.',
          position: 'center',
          confirmButtonText: 'Done',
          icon: 'success'
        })
        this.registerForm.reset()
      }
    })
  }

}
