import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../../cars/core/service/car.service';
import { DriverService } from '../../drivers/core/service/driver.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { BranchService } from '../core/service/branch.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-branchdetails',
  standalone: true,
  imports: [NgxPaginationModule, DatePipe ],
  templateUrl: './branchdetails.component.html',
  styleUrl: './branchdetails.component.scss'
})
export class BranchdetailsComponent implements OnInit{
  private readonly _CarService = inject(CarService)
  private readonly _DriverService = inject(DriverService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  branchId:string | null = null
  companyId:string | null = null
  allCars:any[] = []
  driverBranch:any[] = []
  allPage:any = 0
  currentPage:any = 0
  pageSize:any = 0
  totalCars:any = 0
  totalDrivers:any = 0

  constructor(){
    this.companyId = localStorage.getItem('companyId')
  }

  ngOnInit(): void {
    this.getBranchById()
  }

  getBranchById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.branchId = params.get('id')
        this.getAllCars()
        this.getAllDrivers()
      }
    })
  }

  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
        this.totalCars = res.data.totalCount
        this.allPage = Math.ceil(res.data.totalCount / res.data.pageSize)
        this.currentPage = res.data.pageNumber
        this.pageSize = res.data.pageSize
      }
    })
  }

  getAllDrivers():void{
    this._DriverService.GetDriversInBranch(this.branchId).subscribe({
      next:(res)=>{
        this.driverBranch = res.data.items
        this.totalDrivers = res.data.totalCount
      }
    })
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._CarService.GetAllCarsByBranchId(this.branchId, searchTerm).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
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

    this.allCars.sort((a, b) => {
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
    this._CarService.GetAllCarsByBranchId(this.branchId, '' , page).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
      }
    })
  }

  onChangePageSize(event:Event):void{
    let pageSize = (event.target as HTMLSelectElement).value
    this._CarService.GetAllCarsByBranchId(this.branchId, '' , 1, pageSize).subscribe({
      next:(res)=>{
        this.pageSize = pageSize
        this.allCars = res.data.items
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
}
