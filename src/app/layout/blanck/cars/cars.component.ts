import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { CarService } from './core/service/car.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe, isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DriverService } from '../drivers/core/service/driver.service';
import { ToastrService } from 'ngx-toastr';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [FormsModule, HeaderComponent, ReactiveFormsModule, NgxPaginationModule, NgFor, NgxDropzoneModule, DatePipe],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CarService = inject(CarService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _DriverService = inject(DriverService)
  private readonly _ToastrService = inject(ToastrService)

  allCars:any[] = []
  allDrivers:any[] = []
  title:string = ''
  branchId:string | null = null
  userId:string | null = null
  allPage:number = 1;
  currentPage:number = 1
  pageSize:any = 1
  carCount:number = 0
  driverCount:number = 0
  selectAll = false;
  carNumberEn:string = ''
  carNumberAr:string = ''
  carLetterEn1:string = ''
  carLetterEn2:string = ''
  carLetterEn3:string = ''
  carLetterAr1:string = ''
  carLetterAr2:string = ''
  carLetterAr3:string = ''

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.branchId = localStorage.getItem('branchId')
      this.userId = localStorage.getItem('userId')
    }
  }

  ngOnInit(): void {
    this.getAllCars()
    this.getAllDriver()
    this.addDriver()
  }

  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
        this.carCount = res.data.totalCount
        this.allPage = Math.ceil(res.data.totalCount / res.data.pageSize)
        this.currentPage = res.data.pageNumber
        this.pageSize = res.data.pageSize
      }
    })
  }

  getAllDriver():void{
    this._DriverService.GetDriversInBranch(this.branchId).subscribe({
      next:(res)=>{
        this.allDrivers = res.data.items
      }
    })
  }

  carForm:FormGroup = this._FormBuilder.group({
    model:[''],
    carNumber:[''],
    color:[''],
    cardNum:[''],
    licenseDate:[''],
    branchId:[''],
    petrolType:[''],
    driversId:this._FormBuilder.array([]),
  })

  get drivers():FormArray {
    return this.carForm.get('driversId') as FormArray;
  }

  addDriver() {
    const driverControl = this._FormBuilder.control('');
    this.drivers.push(driverControl);
    this.driverCount++
  }

  removeDriver(index: number) {
    this.drivers.removeAt(index);
    this.driverCount--
  }

  submitCarForm():void{
    let data = this.carForm.value
    let carPaletEn = `${this.carNumberEn} ${this.carLetterEn1} ${this.carLetterEn2} ${this.carLetterEn3}`
    let carPaletAr = `${this.carNumberAr} ${this.carLetterAr1} ${this.carLetterAr2} ${this.carLetterAr3}`
    let carPalate = `${carPaletEn} / ${carPaletAr}`
    data.branchId = this.branchId
    data.carNumber = carPalate
    data.cardNum = data.model
    data.createdBy = this.userId

    this._CarService.CreateCar(data).subscribe({
      next:(res)=>{
        this.getAllCars()
        this.carForm.reset()
        this.drivers.clear()
        this.addDriver()
        this._ToastrService.success(res.msg)
        this.carNumberEn= ''
        this.carNumberAr= ''
        this.carLetterEn1= ''
        this.carLetterEn2= ''
        this.carLetterEn3= ''
        this.carLetterAr1= ''
        this.carLetterAr2= ''
        this.carLetterAr3= ''
      }
    })
  }

  DeleteCar(id:string):void{
    this._CarService.DeleteCar(id).subscribe({
      next:(res)=>{
        this.getAllCars()
        this._ToastrService.error(res.msg)
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

  isChecked:boolean = false
  toggleChecked():void{
    if(this.isChecked){
      this.isChecked = false
    } else {
      this.isChecked = true
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

  @ViewChild('template') tableTemplate!:ElementRef
  downloadTemplateExcel():void{
    // Create a workbook and sheet from the HTML table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableTemplate.nativeElement);

    // Create a new workbook with the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to Excel file
    XLSX.writeFile(wb, 'table_data.xlsx'); // Download the file as 'table_data.xlsx'
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

    this._CarService.ImportCars(formData).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
      }
    })
  }
}
