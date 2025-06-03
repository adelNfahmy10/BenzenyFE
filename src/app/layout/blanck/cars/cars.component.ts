import { Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { CarService } from './core/service/car.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DriverService } from '../drivers/core/service/driver.service';
import { ToastrService } from 'ngx-toastr';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [FormsModule, HeaderComponent, ReactiveFormsModule, NgxPaginationModule, NgFor, NgxDropzoneModule, NgClass],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CarService = inject(CarService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _DriverService = inject(DriverService)
  private readonly _ToastrService = inject(ToastrService)

  branchId: WritableSignal<string> = signal(localStorage.getItem('branchId') || '');
  userId: WritableSignal<string> = signal(localStorage.getItem('userId') || '');
  allCars: WritableSignal<any[]> = signal([]);
  allDrivers: WritableSignal<any[]> = signal([]);
  title: WritableSignal<string> = signal('');
  allPage: WritableSignal<number> = signal(1);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(1);
  carCount: WritableSignal<number> = signal(0);
  driverCount: WritableSignal<number> = signal(0);
  selectAll: WritableSignal<boolean> = signal(false);
  carNumberEn: WritableSignal<string> = signal('');
  carNumberAr: WritableSignal<string> = signal('');
  carLetterEn1: WritableSignal<string> = signal('');
  carLetterEn2: WritableSignal<string> = signal('');
  carLetterEn3: WritableSignal<string> = signal('');
  carLetterAr1: WritableSignal<string> = signal('');
  carLetterAr2: WritableSignal<string> = signal('');
  carLetterAr3: WritableSignal<string> = signal('');
  open: WritableSignal<boolean> = signal(false);
  isChecked: WritableSignal<boolean> = signal(false);
  selectedRowId: WritableSignal<number | null> = signal(null);

  ngOnInit(): void {
    this.getAllCars()
    this.getAllDriver()
    this.addDriver()
  }

  selectedCarIds: number[] = [];
  isSelected(carId: number): boolean {
    return this.selectedCarIds.includes(carId);
  }

  toggleSelection(carId: number): void {
    if (this.selectedCarIds.includes(carId)) {
      this.selectedCarIds = this.selectedCarIds.filter(id => id !== carId);
      console.log(this.selectedCarIds);
    } else {
      this.selectedCarIds.push(carId);
      console.log(this.selectedCarIds);
    }
  }

  isAllSelected(): boolean {
    return this.allCars().length > 0 && this.allCars().every(car => this.selectedCarIds.includes(car.id));
  }

  toggleAllSelection(event: any): void {
    if (event.target.checked) {
      this.selectedCarIds = this.allCars().map(car => car.id);
      console.log(this.selectedCarIds);

    } else {
      this.selectedCarIds = [];
    }
  }


  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId()).subscribe({
      next: (res) => {
        this.allCars.set(res.data.items);
        this.carCount.set(res.data.totalCount);
        this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
        this.currentPage.set(res.data.pageNumber);
        this.pageSize.set(res.data.pageSize);
      }
    });
  }

  getAllDriver():void{
    this._DriverService.GetDriversInBranch(this.branchId()).subscribe({
      next: (res) => {
        this.allDrivers.set(res.data.items);
      }
    });
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
    this.driverCount.set(this.driverCount() + 1);
  }

  removeDriver(index: number) {
    this.drivers.removeAt(index);
    this.driverCount.set(this.driverCount() - 1);
  }

  submitCarForm():void{
    let data = this.carForm.value;
    let carPaletEn = `${this.carNumberEn()} ${this.carLetterEn1()} ${this.carLetterEn2()} ${this.carLetterEn3()}`;
    let carPaletAr = `${this.carNumberAr()} ${this.carLetterAr1()} ${this.carLetterAr2()} ${this.carLetterAr3()}`;
    let carPalate = `${carPaletEn} / ${carPaletAr}`;
    data.branchId = this.branchId();
    data.carNumber = carPalate;
    data.cardNum = data.model;
    data.createdBy = this.userId();

    this._CarService.CreateCar(data).subscribe({
      next: (res) => {
        this.getAllCars();
        this.carForm.reset();
        this.drivers.clear();
        this.addDriver();
        this._ToastrService.success(res.msg);
        this.carLetterEn1.set('');
        this.carLetterEn2.set('');
        this.carLetterEn3.set('');
        this.carNumberEn.set('');
        this.carLetterAr1.set('');
        this.carLetterAr2.set('');
        this.carLetterAr3.set('');
        this.carNumberAr.set('');
      }
    });
  }

  DeleteCar(id:string):void{
    this._CarService.DeleteCar(id).subscribe({
      next: (res) => {
        this.getAllCars();
        this._ToastrService.error(res.msg);
      }
    });
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._CarService.GetAllCarsByBranchId(this.branchId(), searchTerm).subscribe({
      next: (res) => {
        this.allCars.set(res.data.items);
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

    this.allCars.update(cars =>
      [...cars].sort((a, b) => {
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
    this.currentPage.set(page);
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._CarService.GetAllCarsByBranchId(this.branchId(), '', page).subscribe({
      next: (res) => {
        this.allCars.set(res.data.items);
      }
    });
  }

  onChangePageSize(event:Event):void{
    let pageSize = +(event.target as HTMLSelectElement).value;
    this._CarService.GetAllCarsByBranchId(this.branchId(), '', 1, pageSize).subscribe({
      next: (res) => {
        this.pageSize.set(pageSize);
        this.allCars.set(res.data.items);
      }
    });
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

  @ViewChild('template') tableTemplate!:ElementRef
  downloadTemplateExcel():void{
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableTemplate.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }

  files = signal<File[]>([]);
  onSelect(event:any) {
    this.files.update((prev) => [...prev, ...event.addedFiles]);

  }
  onRemove(event:any) {
    this.files.update((prev) => prev.filter((file) => file !== event));
  }

  uploadFileExcel():void{
    let formData = new FormData();
    formData.append('BranchId', this.branchId());
    this.files().forEach((item) => {
      formData.append('File', item);
    });

    this._CarService.ImportCars(formData).subscribe({
      next: (res) => {
        this._ToastrService.success(res.msg);
        this.files.set([])
        this.getAllCars()
      }
    });
  }
}
