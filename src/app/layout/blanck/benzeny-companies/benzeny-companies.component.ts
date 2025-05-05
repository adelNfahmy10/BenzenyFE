import { Component, ElementRef, inject, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { NgxPaginationModule } from 'ngx-pagination';
import { isPlatformBrowser, NgFor } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../companies/core/service/company.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-benzeny-companies',
  standalone: true,
  imports: [FormsModule, HeaderComponent, ReactiveFormsModule, NgxPaginationModule, NgxDropzoneModule, RouterLink],
  templateUrl: './benzeny-companies.component.html',
  styleUrl: './benzeny-companies.component.scss'
})
export class BenzenyCompaniesComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CompanyService = inject(CompanyService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  branchId: WritableSignal<string | null> = signal(localStorage.getItem('branchId'));
  userId: WritableSignal<string | null> = signal(localStorage.getItem('userId'));
  allCompanies: WritableSignal<any[]> = signal([]);
  title: WritableSignal<string> = signal('Drivers');
  allPage: WritableSignal<number> = signal(1);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(1);
  selectAll: WritableSignal<boolean> = signal(false);
  companyCount: WritableSignal<string> = signal('');
  files: WritableSignal<File[]> = signal([]);
  sortColumn: WritableSignal<string> = signal('');
  sortDirection: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.getallCompanies()
  }

  getallCompanies():void{
    this._CompanyService.GetAllCompanies().subscribe({
      next:(res)=>{
        this.allCompanies.set(res.data.items);
        this.companyCount.set(res.data.totalCount);
        this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
        this.currentPage.set(res.data.pageNumber);
        this.pageSize.set(res.data.pageSize);
      }
    })

  }

  deleteCompnay(id:any):void{
    this._CompanyService.DeleteCompany(id).subscribe({
      next:(res)=>{
        this._ToastrService.success('Company Is Deleted !')
        this.getallCompanies()
      }
    })
  }
  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._CompanyService.GetAllCompanies("", 1, page).subscribe({
      next:(res)=>{
        this.allCompanies.set(res.data.items);
        this.companyCount.set(res.data.totalCount);
        this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
        this.currentPage.set(res.data.pageNumber);
        this.pageSize.set(res.data.pageSize);
      }
    })
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._CompanyService.GetAllCompanies(searchTerm).subscribe({
      next: (res) => {
        this.allCompanies.set(res.data.items);
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

    this.allCompanies.update(drivers =>
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
    this._CompanyService.GetAllCompanies(1, pageSize).subscribe({
      next: (res) => {
        this.pageSize.set(pageSize);
        this.allCompanies.set(res.data.items);
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

}
