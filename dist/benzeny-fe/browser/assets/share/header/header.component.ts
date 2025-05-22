import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent{
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  companyName:string | null = null
  userName:string | null = null
  branchId:string | null = null

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.companyName = localStorage.getItem('companyName')
      this.userName = localStorage.getItem('userName')
      this.branchId = localStorage.getItem('branchId')
    }
  }

}
