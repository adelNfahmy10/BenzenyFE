import { Component, computed, effect, ElementRef, inject, OnInit, PLATFORM_ID, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { DriverService } from './core/service/driver.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { isPlatformBrowser, NgClass, NgFor } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { SettingService } from '../settings/core/services/setting.service';
import { CarService } from '../cars/core/service/car.service';
import { BranchDefultService } from '../../../../core/services/branch-defult.service';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [FormsModule, HeaderComponent, ReactiveFormsModule, NgxPaginationModule, NgFor, NgxDropzoneModule, NgClass, RouterLink],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _DriverService = inject(DriverService)
  private readonly _CarService = inject(CarService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _SettingService = inject(SettingService)
    private readonly _BranchDefultService = inject(BranchDefultService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  // branchId: WritableSignal<string | null> = signal(localStorage.getItem('branchId'));
  branchId: Signal<string> = computed( () => this._BranchDefultService.branchId()! )
  userId: WritableSignal<string | null> = signal(localStorage.getItem('userId'));
  allDrivers: WritableSignal<any[]> = signal([]);
  allCars: WritableSignal<any[]> = signal([]);
  allTags:WritableSignal<any[]> = signal([])
  title: WritableSignal<string> = signal('Drivers');
  allPage: WritableSignal<number> = signal(1);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(1);
  selectAll: WritableSignal<boolean> = signal(false);
  driverCount: WritableSignal<string> = signal('');
  files: WritableSignal<File[]> = signal([]);
  sortColumn: WritableSignal<string> = signal('');
  sortDirection: WritableSignal<boolean> = signal(true);
  get isEnabled(): boolean {
    return this.selectedDriverIds.length > 0;
  }

  constructor(){
    effect(() => {
      const id = this._BranchDefultService.branchId();
      if (id) {
        console.log('Branch ID changed:', id);
        this.getAllDrivers()
        this.getAllCars()
      }
    });
  }

  ngOnInit(): void {
    this.getAllTags()
  }

  selectedDriverIds: number[] = [];
  isSelected(DriverId: number): boolean {
    return this.selectedDriverIds.includes(DriverId);
  }

  toggleSelection(DriverId: number): void {
    if (this.selectedDriverIds.includes(DriverId)) {
      this.selectedDriverIds = this.selectedDriverIds.filter(id => id !== DriverId);
      console.log(this.selectedDriverIds);
    } else {
      this.selectedDriverIds.push(DriverId);
      console.log(this.selectedDriverIds);
    }
  }

  isAllSelected():any {
    return this.allDrivers().length > 0 && this.allDrivers().every(Driver => this.selectedDriverIds.includes(Driver.id));
  }

  toggleAllSelection(event: any): void {
    if (event.target.checked) {
      this.selectedDriverIds = this.allDrivers().map(Driver => Driver.id);
    } else {
      this.selectedDriverIds = [];
    }
  }


  limitVehical:boolean = false
  showDays:boolean = false
  selectDays(event:Event):void{
    let selected = (event.target as HTMLSelectElement).value
    if(selected == '2'){
      this.showDays = true
    } else {
      this.showDays = false
    }
  }

  selectLimit(event:Event):void{
    let selected = (event.target as HTMLSelectElement).value
    if(selected == '2'){
      this.limitVehical = true
    } else {
      this.limitVehical = false
    }
  }

  getAllDrivers():void{
    this._DriverService.GetDriversInBranch(this.branchId()).subscribe({
      next: (res) => {
        this.allDrivers.set(res.data.items);
        this.driverCount.set(res.data.totalCount);
        this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
        this.currentPage.set(res.data.pageNumber);
        this.pageSize.set(res.data.pageSize);
      }
    });
  }

  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId()).subscribe({
      next: (res) => {
        this.allCars.set(res.data.items)
      }
    });
  }

  getAllTags():void{
    this._SettingService.GetAllTags().subscribe({
      next:(res)=>{
        this.allTags.set(res.data)
      }
    })
  }

  driverForm:FormGroup = this._FormBuilder.group({
    branchId:[''],
    createdBy:[''],
    fullName:[''],
    phoneNumber:[''],
    tagId:[''],
    license:[''],
    licenseDegree:['']
  })

  submitDriverForm():void{
    let data = this.driverForm.value;
    data.branchId = this.branchId();
    data.createdBy = this.userId();
    this._DriverService.CreateDriver(data).subscribe({
      next: (res) => {
        this.getAllDrivers();
        this.driverForm.reset();
        this._ToastrService.success(res.msg);
      }
    });
  }

  DeleteDriver(id:any):void{
    this._DriverService.DeleteDriver(id).subscribe({
      next: (res) => {
        this.getAllDrivers();
        this._ToastrService.error(res.msg);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._DriverService.GetDriversInBranch(this.branchId(), '', page).subscribe({
      next: (res) => {
        this.allDrivers.set(res.data.items);
      }
    });
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._DriverService.GetDriversInBranch(this.branchId(), searchTerm).subscribe({
      next: (res) => {
        this.allDrivers.set(res.data.items);
      }
    });
  }

  onSelect(event:any) {
    this.files.update((prev) => [...prev, ...event.addedFiles]);

  }
  onRemove(event:any) {
    this.files.update((prev) => prev.filter((file) => file !== event));
  }

  uploadFileExcel():void{
    let formData = new FormData();
    formData.append('BranchId', this.branchId()!);
    this.files().forEach((item) => {
      formData.append('File', item);
    });

    this._DriverService.ImportDrivers(formData).subscribe({
      next: (res) => {
        this._ToastrService.success(res.msg);
      }
    });
  }

  /* Sort Table */
  sortTable(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(!this.sortDirection());
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(true);
    }

    this.allDrivers.update(drivers =>
      [...drivers].sort((a, b) => {
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

  onChangePageSize(event:Event):void{
    let pageSize = +(event.target as HTMLSelectElement).value;
    this._DriverService.GetDriversInBranch(this.branchId(), '', 1, pageSize).subscribe({
      next: (res) => {
        this.pageSize.set(pageSize);
        this.allDrivers.set(res.data.items);
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

  // Assign Drivers To Cars
  assignToCarForm:FormGroup = this._FormBuilder.group({
    driverId:[null],
    carId:[null],
  })

  submitAssignToCar():void{
    let data = this.assignToCarForm.value
    this._DriverService.AssignDriverToCar(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Assign Is Successfully')
        this.assignToCarForm.reset()
      }
    })
  }

  unassignToCar(driverId:number, carId:number):void{
    let data = {
      driverId: driverId,
      carId: carId
    }
    this._DriverService.UnassignDriverFromCar(data).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
      }
    })
  }

  // Refund Amount To Drivers
  refundAmountForm:FormGroup = this._FormBuilder.group({
    driversIds: [null],
    amount:[null],
    transactionType:[''],
  })

  submitRefundAmount():void{
    let data = this.refundAmountForm.value
    data.driversIds = this.selectedDriverIds
    data.transactionType = +data.transactionType
    this._DriverService.refundAmountToDriver(data).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.refundAmountForm.reset()
      }
    })
  }

  // Refund Amount Form Manager
  refundFromManagerForm:FormGroup = this._FormBuilder.group({
    amount:[null],
  })

  submitRefundFromManager():void{
    let data = this.refundAmountForm.value
    this._ToastrService.success(`Refund ${data.amount} is Successfully`)
  }
  // Driver Switch Active
  switchActiveDriver(id:number):void{
    this._DriverService.DriverSwitchActive(id).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.getAllDrivers()
      }
    })
  }

}
