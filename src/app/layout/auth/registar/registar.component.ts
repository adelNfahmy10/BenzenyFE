import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';

@Component({
  selector: 'app-registar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registar.component.html',
  styleUrl: './registar.component.scss'
})
export class RegistarComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  registerForm:FormGroup = this._FormBuilder.group({
    fullName: [''],
    username: [''],
    email: [''],
    mobile: [''],
    password: [''],
    companyName: [''],
    description: [''],
    file: [''],
  })

  submitRegisterForm():void{
    let data = this.registerForm.value
    console.log(data);
    this._AuthService.register(data).subscribe({
      next:(res)=>{
        console.log(res);
        this._Router.navigate(['/login'])
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
