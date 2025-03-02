import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { DriverService } from './core/service/driver.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { isPlatformBrowser, NgFor } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [FormsModule, HeaderComponent, ReactiveFormsModule, NgxPaginationModule, NgFor, NgxDropzoneModule  ],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _DriverService = inject(DriverService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  branchId:string | null = null
  userId:string | null = null
  allDrivers:any[] = []
  title:string = 'Drivers'
  allPage:number = 1;
  currentPage:number = 1
  pageSize:any = 1
  selectAll = false;
  driverCount:string = ''

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.branchId = localStorage.getItem('branchId')
      this.userId = localStorage.getItem('userId')
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._DriverService.GetDriversInBranch(this.branchId, '' , page).subscribe({
      next:(res)=>{
        this.allDrivers = res.data.items
      }
    })
  }



  ngOnInit(): void {
    this.getAllDrivers()
  }

  getAllDrivers():void{
    this._DriverService.GetDriversInBranch(this.branchId).subscribe({
      next:(res)=>{
        this.allDrivers = res.data.items
        this.driverCount = res.data.totalCount
        this.allPage = Math.ceil(res.data.totalCount / res.data.pageSize)
        this.currentPage = res.data.pageNumber
        this.pageSize = res.data.pageSize
      }
    })
  }

  driverForm:FormGroup = this._FormBuilder.group({
    branchId:[''],
    createdBy:[''],
    fullName:[''],
    phoneNumber:[''],
    license:[''],
    licenseDegree:['']
  })

  submitDriverForm():void{
    let data = this.driverForm.value
    data.branchId = this.branchId
    data.createdBy = this.userId
    this._DriverService.CreateDriver(data).subscribe({
      next:(res)=>{
        this.getAllDrivers()
        this.driverForm.reset()
        this._ToastrService.success(res.msg)
      }
    })
  }

  DeleteDriver(id:any):void{
    this._DriverService.DeleteDriver(id).subscribe({
      next:(res)=>{
        this.getAllDrivers()
        this._ToastrService.error(res.msg)
      }
    })
  }

  downloadTableExcel():void{
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.template.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }

  @ViewChild('template') tableTemplate!:ElementRef
  downloadTemplateExcel():void{
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableTemplate.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }


  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._DriverService.GetDriversInBranch(this.branchId, searchTerm).subscribe({
      next:(res)=>{
        this.allDrivers = res.data.items
      }
    })
  }
  // Check if the row is selected
  isSelected(row: any) {
    return row.selected;
  }

  // Toggle row selection
  toggleRowSelection(row: any) {
    row.selected = !row.selected;
  }

  // Toggle Select All checkbox
  toggleSelectAll() {
    this.allDrivers.forEach((row:any) => row.selected = this.selectAll);
  }

  /* Download Table With PDF */
  open:boolean = false
  openList():void{
    if(this.open){
      this.open = false
      console.log(this.open);

    } else {
      this.open = true
      console.log(this.open);
    }
  }

  // Menu Option In Table
  selectedRowId: number | null = null;
  toggleMenu(rowId: number) {
    if (this.selectedRowId === rowId) {
      this.selectedRowId = null;
    } else {
      this.selectedRowId = rowId;
    }
  }

  files: File[] = [];
  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
    console.log(this.files[0]);
  }
  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadFileExcel():void{
    let formData = new FormData
    formData.append('BranchId', this.branchId!),
    // formData.append('File ', this.files[0])
    this.files.forEach((item, index:number)=>{
      formData.append(`File`, item)
    })

    this._DriverService.ImportDrivers(formData).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
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

    this.allDrivers.sort((a, b) => {
      if (a[column] > b[column]) {
        return this.sortDirection ? 1 : -1;
      } else if (a[column] < b[column]) {
        return this.sortDirection ? -1 : 1;
      } else {
        return 0;
      }
    });
  }


  onChangePageSize(event:Event):void{
    let pageSize = (event.target as HTMLSelectElement).value
    this._DriverService.GetDriversInBranch(this.branchId, '' , 1, pageSize).subscribe({
      next:(res)=>{
        this.pageSize = pageSize
        this.allDrivers = res.data.items
      }
    })
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
