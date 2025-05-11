import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blanck',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './blanck.component.html',
  styleUrl: './blanck.component.scss'
})
export class BlanckComponent {
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _Router = inject(Router)
  userName:string | null = null
  companyId:string | null = null
  branchId:string | null = null
  role:string | null = null

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.userName = localStorage.getItem('userName')
      this.companyId = localStorage.getItem('companyId')
      this.branchId = localStorage.getItem('branchId')
      this.role = localStorage.getItem('role')
    }
  }

  logout():void{
    localStorage.clear()
    this._Router.navigate(['login'])
  }
}
