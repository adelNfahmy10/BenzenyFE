import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxPaginationModule } from 'ngx-pagination';
import * as XLSX from 'xlsx';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { BranchService } from './core/service/branch.service';
import { ReigonandcityService } from '../../../../core/services/reigons/reigonandcity.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../companies/core/service/company.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [ FormsModule, NgxPaginationModule, ReactiveFormsModule, NgClass, HeaderComponent, RouterLink, NgSelectModule, NgFor ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent implements OnInit{
  /* Injection Services */
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _BranchService = inject(BranchService)
  private readonly _CompanyService = inject(CompanyService)
  private readonly _ReigonandcityService = inject(ReigonandcityService)
  private readonly _ToastrService = inject(ToastrService)

  /* All Properties */
  companyId: WritableSignal<string> = signal(localStorage.getItem("companyId") || '');
  allPage: WritableSignal<number> = signal(1);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(1);
  selectAll: WritableSignal<boolean> = signal(false);
  branchCount: WritableSignal<string> = signal('');
  allBranches: WritableSignal<any[]> = signal([]);
  allRegions: WritableSignal<any[]> = signal([]);
  allCity: WritableSignal<any[]> = signal([]);
  getActiveBranch: WritableSignal<any[]> = signal([]);
  getDisActiveBranch: WritableSignal<any[]> = signal([]);
  allUsers: WritableSignal<any[]> = signal([]);
  selectedUser: WritableSignal<string> = signal('');
  activeCount: WritableSignal<number> = signal(0);
  disActiveCount: WritableSignal<number> = signal(0);
  totalCars: WritableSignal<number> = signal(0);
  totalDrivers: WritableSignal<number> = signal(0);

  /* OnInit Function */
  ngOnInit(): void {
    this.getAllRegions()
    this.getAllBranches()
    this.getAllUsersByCompanyId()
    this.addUser()
  }

  /* All Branches */
  getAllBranches():void{
    this._BranchService.GetAllCompanyBranches(this.companyId()).subscribe({
      next:(res)=>{
        this.allBranches.set(res.data.items[0].branchs);
        this.branchCount.set(res.data.totalCount);
        this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
        this.currentPage.set(res.data.pageNumber);
        this.pageSize.set(res.data.pageSize);
        this.activeCount.set(res.data.activeCount);
        this.disActiveCount.set(res.data.inActiveCount);
        this.totalDrivers.set(res.data.items[0].companyDriverCount);
        this.totalCars.set(res.data.items[0].companyCarCount);
      }
    })
  }

  /* All Regions */
  onRegionsChange(event:Event):void{
    let selectId = (event.target as HTMLSelectElement).value;
    this.getCityByRegion(selectId);
  }

  getAllRegions():void{
    this._ReigonandcityService.GetAllRegions().subscribe({
      next: (res) => {
        this.allRegions.set(res.data.items);
      }
    });
  }

  /* All City */
  getCityByRegion(regionId:string):void{
    this._ReigonandcityService.GetCityByRegionId(regionId).subscribe({
      next: (res) => {
        this.allCity.set(res);
      }
    });
  }

  getAllUsersByCompanyId():void{
    this._CompanyService.GetAllUserInCompanyById(this.companyId()).subscribe({
      next: (res) => {
        this.allUsers.set(res.data.items);
      }
    });
  }

  /* Branch Form */
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
  Object.keys(data).forEach((key) => {
    if (key !== 'UserIds') {
      formData.append(key, data[key]);
    }
  });
  data.UserIds.forEach((userId: any) => {
    formData.append('UserIds', userId);
  });

  this._BranchService.CreateBranch(formData).subscribe({
    next: (res) => {
        this.getAllBranches();
        this.branchForm.reset();
        this.users.clear();
        this._ToastrService.success(`${res.result}, ${res.msg}`);
      }
    });
  }


  /* Delete Branch */
  deleteBranch(branchId:string):void{
    this._BranchService.DeleteBranch(branchId).subscribe({
      next: (res) => {
        this.getAllBranches();
        this._ToastrService.error(res.msg);
      }
    });
  }

  /* Switch Active Branches */
  switchActiveBranch(branchId:string):void{
    this._BranchService.SwitchActive(branchId).subscribe({
      next: (res) => {
        this.getAllBranches();
        this._ToastrService.success(res.msg);
      }
    });
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._BranchService.GetAllCompanyBranches(this.companyId(), searchTerm).subscribe({
      next: (res) => {
        this.allBranches.set(res.data.items[0].branchs);
      }
    });
  }

  /* Sort Table */
  sortColumn: WritableSignal<string> = signal('');
  sortDirection: WritableSignal<boolean> = signal(true);

  sortTable(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(!this.sortDirection());
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(true);
    }

    this.allBranches.update(branches =>
      [...branches].sort((a, b) => {
        if (a[column] > b[column]) {
          return this.sortDirection() ? 1 : -1;
        } else if (a[column] < b[column]) {
          return this.sortDirection() ? -1 : 1;
        } else {
          return 0;
        }
      })
    );
  }

  // Pagnation Pages
  onPageChange(page: number): void {
    this.currentPage.set(page) ;
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._BranchService.GetAllCompanyBranches(this.companyId(), '' , page).subscribe({
      next:(res)=>{
        this.allBranches = res.data.items[0].branchs
      }
    })
  }

  onChangePageSize(event:Event):void{
    let pageSize = +(event.target as HTMLSelectElement).value
    this._BranchService.GetAllCompanyBranches(this.companyId(), '' , 1, pageSize).subscribe({
      next:(res)=>{
        this.pageSize.set(pageSize)
        this.allBranches = res.data.items[0].branchs
      }
    })
  }

  /* Download Table With PDF */
  open:boolean = false
  openList():void{
    if(this.open){
      this.open = false
    } else {
      this.open = true
    }
  }

  @ViewChild('table') template!:ElementRef
  downloadPDF():void{
    if(isPlatformBrowser(this._PLATFORM_ID)){
      const data = this.template.nativeElement
      html2canvas(data).then(canvas => {
        const imgWidth = 208
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const heightLeft = imgHeight
        const pdf = new jsPDF('p', 'mm', 'a4');
        const contentDataURL = canvas.toDataURL('image/png')
        pdf.addImage(contentDataURL, 'png', 0, 0, imgWidth, imgHeight)
        pdf.save('table.pdf')
      })
    }
  }

  downloadExcel():void{
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.template.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }
}
