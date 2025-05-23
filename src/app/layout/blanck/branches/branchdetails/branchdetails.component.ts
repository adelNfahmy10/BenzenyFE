import { Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  imports: [NgxPaginationModule, DatePipe, RouterLink],
  templateUrl: './branchdetails.component.html',
  styleUrl: './branchdetails.component.scss'
})
export class BranchdetailsComponent implements OnInit{
  private readonly _CarService = inject(CarService)
  private readonly _DriverService = inject(DriverService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  branchId: WritableSignal<string> = signal('');
  companyId: WritableSignal<string> = signal(localStorage.getItem('companyId') || '');
  allCars: WritableSignal<any[]> = signal([]);
  driverBranch: WritableSignal<any[]> = signal([]);
  allPage: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  pageSize: WritableSignal<number> = signal(0);
  totalCars: WritableSignal<number> = signal(0);
  totalDrivers: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.getBranchById()
  }

  getBranchById():void{
    this._ActivatedRoute.paramMap.subscribe(params => {
      this.branchId.set(params.get('id')!);
      this.getAllCars();
      this.getAllDrivers();
    });
  }

  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId()).subscribe(res => {
      this.allCars.set(res.data.items);
      this.totalCars.set(res.data.totalCount);
      this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
      this.currentPage.set(res.data.pageNumber);
      this.pageSize.set(res.data.pageSize);
    });
  }

  getAllDrivers():void{
    this._DriverService.GetDriversInBranch(this.branchId()).subscribe(res => {
      this.driverBranch.set(res.data.items);
      this.totalDrivers.set(res.data.totalCount);
    });
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._CarService.GetAllCarsByBranchId(this.branchId(), searchTerm).subscribe(res => {
      this.allCars.set(res.data.items);
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
    this._CarService.GetAllCarsByBranchId(this.branchId(), '', page).subscribe(res => {
      this.allCars.set(res.data.items);
    });
  }

  onChangePageSize(event:Event):void{
    const pageSize = (event.target as HTMLSelectElement).value;
    this._CarService.GetAllCarsByBranchId(this.branchId(), '', 1, pageSize).subscribe(res => {
      this.pageSize.set(Number(pageSize));
      this.allCars.set(res.data.items);
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
    XLSX.writeFile(wb, 'table_data.xlsx');
  }
}
