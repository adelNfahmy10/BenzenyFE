import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Chart , registerables } from 'chart.js';
import { ViewallComponent } from "../../../../assets/share/buttons/viewall/viewall.component";
import { BtnaddComponent } from "../../../../assets/share/buttons/btnadd/btnadd.component";
import { RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { BranchService } from '../branches/core/service/branch.service';
import { ReigonandcityService } from '../../../../core/services/reigons/reigonandcity.service';
import { AuthService } from '../../auth/core/service/auth.service';
import { CompanyService } from './core/service/company.service';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
Chart.register(...registerables)

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ViewallComponent, BtnaddComponent, RouterLink, FormsModule, HeaderComponent, RouterLink, ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CompanyService = inject(CompanyService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ReigonandcityService = inject(ReigonandcityService)
  private readonly _AuthService = inject(AuthService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  companyName:string | null = null
  companyId:string | null = null
  allBranches:any[] = []
  allRegions:any[] = []
  allCity:any[] = []
  allUsers:any[] = []
  branchCount:number = 0
  userCount:number = 0
  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.companyName = localStorage.getItem('companyName')
      this.companyId = localStorage.getItem("companyId")
    }
  }
  ngOnInit(): void {
    this.getAllBranches()
    this.getAllRegions()
    this.getAllUsersByCompanyId()
    this.addUser()
  }
  getAllBranches():void{
    this._BranchService.GetAllCompanyBranches(this.companyId).subscribe({
      next:(res)=>{
        this.allBranches = res.data.items[0].branchs
        this.branchCount = res.data.totalCount
      }
    })
  }
  onRegionsChange(event:Event):void{
    let selectId = (event.target as HTMLSelectElement).value
    this.getCityByRegion(selectId)
  }
  getAllRegions():void{
    this._ReigonandcityService.GetAllRegions().subscribe({
      next:(res)=>{
        this.allRegions = res.data.items
      }
    })
  }
  getCityByRegion(regionId:string):void{
    this._ReigonandcityService.GetCityByRegionId(regionId).subscribe({
      next:(res)=>{
        this.allCity = res
      }
    })
  }
  branchForm:FormGroup = this._FormBuilder.group({
    CompanyId:[''],
    RegionId:[''],
    CityId:[''],
    Address:[''],
    FullName:[''],
    Email:[''],
    Password:[''],
    PhoneNumber:[''],
    IBAN:[''],
    UserIds: this._FormBuilder.array([]),
  })
  get users():FormArray {
    return this.branchForm.get('UserIds') as FormArray;
  }
  addUser(){
    const userControl = this._FormBuilder.control('');
    this.users.push(userControl);
  }
  removeUser(index: number) {
    this.users.removeAt(index);
  }
  submitBranchForm():void{
    let data = this.branchForm.value
    data.CompanyId = this.companyId

    let formData = new FormData()
    formData.append('CompanyId', data.CompanyId),
    formData.append('RegionId', data.RegionId),
    formData.append('CityId', data.CityId),
    formData.append('Address', data.Address),
    formData.append('FullName', data.FullName),
    formData.append('Email', data.Email),
    formData.append('Password', data.Password),
    formData.append('PhoneNumber', data.PhoneNumber),
    formData.append('IBAN', data.IBAN)
    data.UserIds.forEach((userId:any) => {
      formData.append('UserIds', userId);
    });

    this._BranchService.CreateBranch(formData).subscribe({
      next:(res)=>{
        this.getAllBranches()
        this.branchForm.reset()
        this._ToastrService.success(`${res.result}, ${res.msg}`,'Success',{
          positionClass:'toast-bottom-right',
        })
      }
    })
  }

  getAllUsersByCompanyId():void{
    this._CompanyService.GetAllUserInCompanyById(this.companyId!).subscribe({
      next:(res)=>{
        this.allUsers = res.data.items
      }
    })
  }
  userForm:FormGroup = this._FormBuilder.group({
    CompanyId:[''],
    Username:[''],
    FullName:[''],
    Mobile :[''],
    Email:[''],
    Password:['']
  })
  submitUserForm():void{
    let data = this.userForm.value
    data.CompanyId = this.companyId
    let formData = new FormData()
    formData.append('CompanyId', data.CompanyId),
    formData.append('Username', data.Username),
    formData.append('FullName', data.FullName),
    formData.append('Mobile', data.Mobile),
    formData.append('Email', data.Email),
    formData.append('Password', data.Password)

    this._AuthService.register(formData).subscribe({
      next:(res)=>{
        this.getAllUsersByCompanyId()
        this.userForm.reset()
      }
    })
  }
  DeleteUserInCompany(userId:string):void{
    this._CompanyService.DeleteUserInCompany(this.companyId!,userId).subscribe({
      next:(res)=>{
        this._ToastrService.error(res.msg)
        this.getAllUsersByCompanyId()
      }
    })
  }
  switchActiveUser(userId:string):void{
    this._AuthService.SwitchActiveUser(userId).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.getAllUsersByCompanyId()
      }
    })
  }
  selectedRowId: number | null = null;
  toggleMenu(rowId: number) {
    if (this.selectedRowId === rowId) {
      this.selectedRowId = null;
    } else {
      this.selectedRowId = rowId;
    }
  }

  /* Copy ID And IBAN */
  @ViewChild('Id') elementId!:ElementRef
  @ViewChild('Iban') elementIban!:ElementRef
  @ViewChild('ibanBranach') elementIbanBrnach!:ElementRef
  copyId():void{
    const textCopy = this.elementId.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('ID Copied To Clipboard')
    })
    .catch((err) => {
      this._ToastrService.success('Failed To Copy ID')
    });
  }
  copyIban():void{
    const textCopy = this.elementIban.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('IBAN Copied To Clipboard')
    })
    .catch((err) => {
      this._ToastrService.success('Failed To Copy IBAN')
    });
  }
  copyIbanBranches():void{
    const textCopy = this.elementIbanBrnach.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('IBAN Branch Copied To Clipboard','Success',{
        positionClass:'toast-bottom-right',
      })
    })
    .catch((err) => {
      this._ToastrService.success('Failed To Copy IBAN Branch')
    });
  }
}
