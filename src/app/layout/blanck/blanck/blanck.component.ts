import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BranchDefultService } from '../../../../core/services/branch-defult.service';

@Component({
  selector: 'app-blanck',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './blanck.component.html',
  styleUrl: './blanck.component.scss'
})
export class BlanckComponent {
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _BranchDefultService = inject(BranchDefultService)
  private readonly _Router = inject(Router)
  userName:string | null = null
  companyId:string | null = null
  branchId:string | null = null
  userBranches:any[] = []
  role:string | null = null


  switchBranchId(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    this._BranchDefultService.setBranchId(selectedId);
  }

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.userName = localStorage.getItem('userName')
      this.companyId = localStorage.getItem('companyId')
      this.branchId = localStorage.getItem('branchId')
      this.userBranches = JSON.parse(localStorage.getItem('userBranches') || '[]');
      this.role = localStorage.getItem('role')
    }
  }

  logout():void{
    localStorage.clear()
    this._Router.navigate(['login'])
  }

  allBranches:any[] = [
    {branchId: '123', branchName: 'Branch 1'},
    {branchId: '546', branchName: 'Branch 2'},
    {branchId: '854', branchName: 'Branch 3'},
  ]

}
