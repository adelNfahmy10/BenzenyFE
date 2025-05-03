import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgFor } from '@angular/common';
import { CompanyService } from '../../blanck/companies/core/service/company.service';
import Swal from 'sweetalert2';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../assets/environment/environment';

@Component({
  selector: 'app-registar',
  standalone: true,
  imports: [ReactiveFormsModule, NgxDropzoneModule, NgFor, FormsModule, ImageCropperComponent, RouterLink],
  templateUrl: './registar.component.html',
  styleUrl: './registar.component.scss'
})
export class RegistarComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CompanyService = inject(CompanyService)
  private readonly _Router = inject(Router)

  companyId:string = ''
  baseUrl:string = environment.baseURL
  files: File[] = [];

  onSelect(event:any) {
    this.files.push(...event.addedFiles);
  }
  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  filesLogo: File[] = [];
  onSelectLogo(event:any) {
    this.filesLogo.push(...event.addedFiles);
  }
  onRemoveLogo(event:any) {
    this.filesLogo.splice(this.filesLogo.indexOf(event), 1);
  }

  registerForm:FormGroup = this._FormBuilder.group({
    Name: [''],
    Description: [''],
    CompanyEmail: [''],
    CompanyPhone: [''],
    CompanyPicture: [''],
    ViewCompanyPicture: ['../../../../assets/image/defult logo.jpg'],
    Files: [''],
  })
  submitRegisterForm():void{
    let data = this.registerForm.value
    data.Files = this.files[0]
    let formData = new FormData()
    formData.append('Name', data.Name)
    formData.append('Description', data.Description)
    formData.append('CompanyEmail', data.CompanyEmail)
    formData.append('CompanyPhone', data.CompanyPhone)
    formData.append('CompanyPicture', data.CompanyPicture)
    formData.append('ViewCompanyPicture', data.CompanyPicture)
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

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl  = '';

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageBase64 = e.target?.result;
        this.registerForm.get('CompanyPicture')?.setValue(file);
        this.registerForm.get('ViewCompanyPicture')?.setValue(imageBase64);
      };

      reader.readAsDataURL(file);
      this.imageChangedEvent = event;
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
    this.registerForm.get('ViewCompanyPicture')?.setValue(this.croppedImage)
  }
}
