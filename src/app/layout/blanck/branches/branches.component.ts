import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxPaginationModule } from 'ngx-pagination';
import * as XLSX from 'xlsx';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { BranchService } from './core/service/branch.service';
import { ReigonandcityService } from '../../../../core/services/reigons/reigonandcity.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [ FormsModule, NgxPaginationModule, ReactiveFormsModule, NgClass, HeaderComponent, RouterLink ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent implements OnInit{
  /* Injection Services */
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _BranchService = inject(BranchService)
  private readonly _ReigonandcityService = inject(ReigonandcityService)
  private readonly _ToastrService = inject(ToastrService)

  /* All Properties */
  allPage:number = 1;
  currentPage:number = 1
  pageSize:any  = 1
  selectAll = false;
  branchCount:string = ''
  companyId:string | null = null
  allBranches:any[] = []
  allRegions:any[] = []
  allCity:any[] = []
  getActiveBranch:any[] = []
  getDisActiveBranch:any[] = []
  activeCount:number = 0
  disActiveCount:number = 0
  totalCars:number = 0
  totalDrivers:number = 0

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.companyId = localStorage.getItem("companyId")
    }
  }

  /* OnInit Function */
  ngOnInit(): void {
    this.getAllRegions()
    this.getAllBranches()
  }

  /* All Branches */
  getAllBranches():void{
    this._BranchService.GetAllCompanyBranches(this.companyId).subscribe({
      next:(res)=>{
        this.allBranches = res.data.items[0].branchs
        this.branchCount = res.data.totalCount
        this.allPage = Math.ceil(res.data.totalCount / res.data.pageSize)
        this.currentPage = res.data.pageNumber
        this.pageSize = res.data.pageSize
        this.activeCount = res.data.activeCount
        this.disActiveCount = res.data.inActiveCount
        this.totalDrivers = res.data.items[0].companyDriverCount
        this.totalCars = res.data.items[0].companyCarCount
      }
    })
  }

  /* All Regions */
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

  /* All City */
  getCityByRegion(regionId:string):void{
    this._ReigonandcityService.GetCityByRegionId(regionId).subscribe({
      next:(res)=>{
        this.allCity = res
      }
    })
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
  })

  /* Submit Branch Form */
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

    this._BranchService.CreateBranch(formData).subscribe({
      next:(res)=>{
        this.branchForm.reset()
        this.getAllBranches()
        this._ToastrService.success(res.msg)
      }
    })
  }

  /* Delete Branch */
  deleteBranch(branchId:string):void{
    this._BranchService.DeleteBranch(branchId).subscribe({
      next:(res)=>{
        this.getAllBranches()
        this._ToastrService.error(res.msg)
      }
    })
  }

  /* Switch Active Branches */
  switchActiveBranch(branchId:string):void{
    this._BranchService.SwitchActive(branchId).subscribe({
      next:(res)=>{
        this.getAllBranches()
        this._ToastrService.success(res.msg)
      }
    })
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._BranchService.GetAllCompanyBranches(this.companyId, searchTerm).subscribe({
      next:(res)=>{
        this.allBranches = res.data.items[0].branchs
      }
    })
  }

  /* Sort Table */
  sortColumn: string = '';
  sortDirection: boolean = true;
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = true;
    }

    this.allBranches.sort((a, b) => {
      if (a[column] > b[column]) {
        return this.sortDirection ? 1 : -1;
      } else if (a[column] < b[column]) {
        return this.sortDirection ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  // Pagnation Pages
  onPageChange(page: number): void {
    this.currentPage = page;
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._BranchService.GetAllCompanyBranches(this.companyId, '' , page).subscribe({
      next:(res)=>{
        this.allBranches = res.data.items[0].branchs
      }
    })
  }

  onChangePageSize(event:Event):void{
    let pageSize = (event.target as HTMLSelectElement).value
    this._BranchService.GetAllCompanyBranches(this.companyId, '' , 1, pageSize).subscribe({
      next:(res)=>{
        this.pageSize = pageSize
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
    XLSX.writeFile(wb, 'table_data.xlsx'); // Download the file as 'table_data.xlsx'
  }

  // CheckBox Main Branch Toggle
  // isChecked:boolean = false
  // toggleChecked():void{
  //   if(this.isChecked){
  //     this.isChecked = false
  //   } else {
  //     this.isChecked = true
  //   }
  // }

}
