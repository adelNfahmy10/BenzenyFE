import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule, NgClass, NgIf, NgFor],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit{
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  @Input() displayedColumns: { key: string, label: string }[] = [];
  @Input() filteredData: any[] = [];

  ngOnInit(): void {
    console.log(this.filteredData);
    if(this.filteredData.length > 0) {
      this.displayedColumns = Object.keys(this.filteredData[0])
        .filter(key => key !== 'selected')
        .map(key => ({
          key,
          label: this.formatLabel(key)
        }));
    }
  }
  formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  selectAll: boolean = false;
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  page: number = 1;

  toggleSelectAll() {
    let listId: number[] = [];
    this.filteredData.forEach(row => {
      row.selected = this.selectAll
      if(row.selected){
        listId.push(row.id)
      }
    });
    console.log(listId);
  }

  toggleRowSelection(row: any) {
    row.selected = !row.selected;
    let rowId = ''
    if(row.selected){
      rowId = row.id
      console.log(rowId);
    } else {
      rowId = ''
      console.log(rowId);
    }
  }

  sortTable(columnKey: string) {
    if (this.sortColumn === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortOrder = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];
      return this.sortOrder === 'asc'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
  }

  searchTerm: string = '';

  onSearch() {
    console.log(this.searchTerm);
  }

  fetchDataFromApi() {
    console.log(this.searchTerm);
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
    // Create a workbook and sheet from the HTML table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.template.nativeElement);

    // Create a new workbook with the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to Excel file
    XLSX.writeFile(wb, 'table_data.xlsx'); // Download the file as 'table_data.xlsx'
  }
}
