import { Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
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
import { NgClass, NgFor } from '@angular/common';
import { UsersService } from './core/service/users.service';
import { RolesService } from '../../../../core/services/roles.service';
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
  private readonly _RolesService = inject(RolesService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  // Global Properties
  companyName: WritableSignal<string> = signal(localStorage.getItem('companyName') || '');
  companyId: WritableSignal<string> = signal(localStorage.getItem('companyId') || '');
  allBranches: WritableSignal<any[]> = signal([]);
  allRegions: WritableSignal<any[]> = signal([]);
  allCity: WritableSignal<any[]> = signal([]);
  allUsers: WritableSignal<any[]> = signal([]);
  allRoles: WritableSignal<any[]> = signal([]);
  selectedRoles: WritableSignal<string[]> = signal([]);
  companyData: WritableSignal<any> = signal({});
  branchCount: WritableSignal<number> = signal(0);
  userCount: WritableSignal<number> = signal(0);
  edit: WritableSignal<boolean> = signal(true);

  // Run Funtions When Project Load
  ngOnInit(): void {
    this.getAllBranches();
    this.getAllRegions();
    this.getAllUsersByCompanyId();
    this.addUser();
    this.getCompanyById();
    this.getAllRoles();
  }

  // Get All Branches
  getAllBranches():void{
    this._BranchService.GetAllCompanyBranches(this.companyId()).subscribe(res => {
      this.allBranches.set(res.data.items[0].branchs);
      this.branchCount.set(res.data.totalCount);
    });
  }

  // Get Data Company By ID
  getCompanyById(): void {
    this._CompanyService.GetCompanyById(this.companyId()).subscribe(res => {
      this.companyData.set(res.data);
    });
  }

  // Select Regions To Get RegionsID
  onRegionsChange(event:Event):void{
    const selectId = (event.target as HTMLSelectElement).value;
    this.getCityByRegion(selectId);
  }

  // Get All Regions
  getAllRegions():void{
    this._ReigonandcityService.GetAllRegions().subscribe(res => {
      this.allRegions.set(res.data.items);
    });
  }

  // Get All City By RegionID
  getCityByRegion(regionId:string):void{
    this._ReigonandcityService.GetCityByRegionId(regionId).subscribe(res => {
      this.allCity.set(res);
    });
  }

  // Get Users By CompanyID
  getAllUsersByCompanyId():void{
    this._CompanyService.GetAllUserInCompanyById(this.companyId()).subscribe(res => {
      this.allUsers.set(res.data.items);
      this.userCount.set(res.data.totalCount)
    });
  }

  // Get All Roles
  getAllRoles():void{
    this._RolesService.getAllRoles().subscribe(res => {
      this.allRoles.set(res.data);
    });
  }
  toggleRoleSelection(role: any, event: any) {
    if (event.target.checked) {
      this.selectedRoles.update(roles => [...roles, role.name]);
    } else {
      this.selectedRoles.update(roles => roles.filter(r => r !== role.name));
    }
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
    let data = this.branchForm.value;
    data.CompanyId = this.companyId();
    let formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    data.UserIds.forEach((userId: any) => formData.append('UserIds', userId));

    this._BranchService.CreateBranch(formData).subscribe(res => {
      this.getAllBranches();
      this.branchForm.reset();
      this.users.clear();
      this._ToastrService.success(`${res.result}, ${res.msg}`, 'Success', { positionClass: 'toast-bottom-right' });
    });
  }

  // Form User To Create
  userForm:FormGroup = this._FormBuilder.group({
    CompanyId:[''],
    fullName:[''],
    email:[''],
    mobile:[''],
    roles: this._FormBuilder.array([]),
  })
  /* Submit User Form */
  submitUserForm():void{
    let data = this.userForm.value;
    data.CompanyId = this.companyId();
    data.roles = this.selectedRoles();
    this._UsersService.addUser(data).subscribe(res => {
      this.getAllUsersByCompanyId();
      this._ToastrService.success(res.msg);
    });
  }

  DeleteUserInCompany(userId:string):void{
    this._CompanyService.DeleteUserInCompany(this.companyId(), userId).subscribe(res => {
      this._ToastrService.error(res.msg);
      this.getAllUsersByCompanyId();
    });
  }
  switchActiveUser(userId:string):void{
    this._UsersService.SwitchActiveUser(userId).subscribe(res => {
      this._ToastrService.success(res.msg);
      this.getAllUsersByCompanyId();
    });
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
    this.edit.update(val => !val);
    this.edit() ? this.companyForm.disable() : this.companyForm.enable();
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
