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
import { CompanyService } from './core/service/company.service';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { UsersService } from './core/service/users.service';
Chart.register(...registerables)

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ViewallComponent, BtnaddComponent, RouterLink, FormsModule, HeaderComponent, RouterLink, ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit{
  // Inject Services
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CompanyService = inject(CompanyService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ReigonandcityService = inject(ReigonandcityService)
  private readonly _UsersService = inject(UsersService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  // Global Properties
  companyName:string = ''
  companyId:string = ''
  allBranches:any[] = []
  allRegions:any[] = []
  allCity:any[] = []
  allUsers:any[] = []
  companyData:any = {}
  branchCount:number = 0
  userCount:number = 0
  edit:boolean = true

  // Get Local Storage Data
  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.companyName = localStorage.getItem('companyName')!
      this.companyId = localStorage.getItem("companyId")!
    }
  }

  // Run Funtions When Project Load
  ngOnInit(): void {
    this.getAllBranches()
    this.getAllRegions()
    this.getAllUsersByCompanyId()
    this.addUser()
    this.getCompanyById()
  }

  // Get All Branches
  getAllBranches():void{
    this._BranchService.GetAllCompanyBranches(this.companyId).subscribe({
      next:(res)=>{
        this.allBranches = res.data.items[0].branchs
        this.branchCount = res.data.totalCount
      }
    })
  }

  // Get Data Company By ID
  getCompanyById():void{
    this._CompanyService.GetCompanyById(this.companyId).subscribe({
      next:(res)=>{
        this.companyData = res.data
        console.log(this.companyData);
      }
    })
  }

  // Select Regions To Get RegionsID
  onRegionsChange(event:Event):void{
    let selectId = (event.target as HTMLSelectElement).value
    this.getCityByRegion(selectId)
  }

  // Get All Regions
  getAllRegions():void{
    this._ReigonandcityService.GetAllRegions().subscribe({
      next:(res)=>{
        this.allRegions = res.data.items
      }
    })
  }

  // Get All City By RegionID
  getCityByRegion(regionId:string):void{
    this._ReigonandcityService.GetCityByRegionId(regionId).subscribe({
      next:(res)=>{
        this.allCity = res
      }
    })
  }

  // Get Users By CompanyID
  getAllUsersByCompanyId():void{
    this._CompanyService.GetAllUserInCompanyById(this.companyId!).subscribe({
      next:(res)=>{
        this.allUsers = res.data.items
      }
    })
  }

  // Form Branch To Create
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
        this.users.clear()
        this._ToastrService.success(`${res.result}, ${res.msg}`,'Success',{
          positionClass:'toast-bottom-right',
        })
      }
    })
  }

  // Form User To Create
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

    this._UsersService.addUser(formData).subscribe({
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
    this._UsersService.SwitchActiveUser(userId).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.getAllUsersByCompanyId()
      }
    })
  }

  // Form Company To Update
  companyForm: FormGroup = this._FormBuilder.group({
    Id: [{ value: '', disabled: true }],
    Name: [{ value: '', disabled: true }],
    Description: [{ value: '', disabled: true }],
    CompanyEmail: [{ value: '', disabled: true }],
    CompanyPhone: [{ value: '', disabled: true }],
    Vat: [{ value: '', disabled: true }],
  });
  updateCompany():void{
    let data = this.companyForm.value
    console.log(data);
  }
  enableFormFields() {
    if (this.edit) {
      this.companyForm.enable();
      this.edit = false
    } else {
      this.companyForm.disable();
      this.edit = true
    }
  }

  /* Copy ID And IBAN */
  @ViewChild('ibanBranach') elementIbanBrnach!:ElementRef
  copyIban(iban: string): void {
    if (!iban || iban === 'Soon') {
      this._ToastrService.warning('No IBAN available to copy');
      return;
    }
    navigator.clipboard.writeText(iban)
    .then(() => {
      this._ToastrService.success('IBAN Copied To Clipboard');
    })
    .catch(() => {
      this._ToastrService.error('Failed To Copy IBAN');
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
