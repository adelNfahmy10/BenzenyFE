import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TableComponent } from "../../../../assets/share/table/table.component";
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { CarService } from './core/service/car.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DriverService } from '../drivers/core/service/driver.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [FormsModule, TableComponent, HeaderComponent, ReactiveFormsModule, NgxPaginationModule, NgClass, NgFor, NgIf],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CarService = inject(CarService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _DriverService = inject(DriverService)

  allCars:any[] = []
  allDrivers:any[] = []
  branchId:string | null = localStorage.getItem('branchId')
  userId:string | null = localStorage.getItem('userId')

  ngOnInit(): void {
    this.getAllCars()
    this.getAllDriver()
    this.addDriver()
  }

  getAllCars():void{
    this._CarService.GetAllCars(this.branchId).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
        console.log(this.allCars);
      }
    })
  }

  getAllDriver():void{
    this._DriverService.GetAllDrivers(this.branchId).subscribe({
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
    this.drivers.controls.forEach((item)=>{
      console.log(item.value);
    })
  }

  removeDriver(index: number) {
    this.drivers.removeAt(index);
    console.log('Driver removed');
  }

  submitCarForm():void{
    let data = this.carForm.value
    data.branchId = this.branchId
    data.cardNum = data.model
    data.createdBy = this.userId

    this._CarService.CreateCar(data).subscribe({
      next:(res)=>{
        this.getAllCars()
        this.carForm.reset()
      }
    })
  }

  DeleteCar(id:string):void{
    this._CarService.DeleteCar(id).subscribe({
      next:(res)=>{
        this.getAllCars()
        console.log(res);
      }
    })
  }

  @ViewChild('table') template!:ElementRef
  downloadExcel():void{
    // Create a workbook and sheet from the HTML table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.template.nativeElement);

    // Create a new workbook with the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to Excel file
    XLSX.writeFile(wb, 'table_data.xlsx'); // Download the file as 'table_data.xlsx'
  }

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

  isChecked:boolean = false
  toggleChecked():void{
    if(this.isChecked){
      this.isChecked = false
    } else {
      this.isChecked = true
    }
  }




  page = 1;
  selectAll = false;

  // Sort column and order
  filterText = '';
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Filtering the data based on search input
  get filteredData() {
    return this.allCars.filter((row) =>
      row.fullName.toLowerCase().includes(this.filterText.toLowerCase())
    );
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
    this.allCars.forEach((row:any) => row.selected = this.selectAll);
  }

  // Sorting function
  sortTable(column: string) {
    if (this.sortColumn === column) {
      // Toggle sort order
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    this.allCars.sort((a:any, b:any) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
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
}
