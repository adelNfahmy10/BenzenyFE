import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../blanck/companies/core/service/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.scss'
})
export class RegisteruserComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _UsersService = inject(UsersService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  userId:string = ''
  userData:any = {}
  ngOnInit(): void {
    this.getUserById()
  }

  getUserById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.userId = params.get('userId')!
        this._UsersService.getUserById(this.userId).subscribe({
          next:(res)=>{
            this.userData = res.data
          }
        })
      }
    })
  }

  userForm:FormGroup = this._FormBuilder.group({
    username:[''],
    password:[''],
  })

  submitUserForm():void{
    let data = this.userForm.value
    data.id = this.userId

    this._UsersService.updateUser(data.id, data).subscribe({
      next:(res)=>{
        console.log(res);
        this._ToastrService.success(res.msg)
        this._Router.navigate(['/login'])
      }
    })
  }
}
