import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  loginForm:FormGroup = this._FormBuilder.group({
    username: [''],
    password: [''],
  })

  submitLoginForm():void{
    let data = this.loginForm.value

    this._AuthService.login(data).subscribe({
      next:(res)=>{
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('userName', res.data.fullName)
        localStorage.setItem('companyId', res.data.companyId)
        localStorage.setItem('companyName', res.data.companyName)
        localStorage.setItem('branchId', res.data.branchId)
        if(localStorage.getItem('branchId')){
          this._Router.navigate(['/balance'])
        } else{
          this._Router.navigate(['/home'])
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
