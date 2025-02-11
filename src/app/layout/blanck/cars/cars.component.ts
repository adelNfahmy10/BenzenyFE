import { Component, ElementRef, ViewChild } from '@angular/core';
import { TableComponent } from "../../../../assets/share/table/table.component";
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [FormsModule, TableComponent, HeaderComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent {
  data = {
    title:'Vehicles',
    items:[
      { id: '646464156', vehicleModel: 'KIA', plate: '597- KSA', driverName: 'Sayed',driverPhone:'+966513122',petrolType:'92',branch:'Madinah',totalBalance:'50 SAR',status:'Active', selected: false },
      { id: '646464157', vehicleModel: 'MARC', plate: '523- KSA', driverName: 'Eslam',driverPhone:'+96624123',petrolType:'72',branch:'Makkah',totalBalance:'50 SAR',status:'Active', selected: false },
      { id: '646464158', vehicleModel: 'BMW', plate: '755- KSA', driverName: 'Fawzi',driverPhone:'+966554121',petrolType:'83',branch:'El Taaef',totalBalance:'50 SAR',status:'Active', selected: false },
      { id: '646464159', vehicleModel: 'SUZ', plate: '090- KSA', driverName: 'Salman',driverPhone:'+96651562',petrolType:'24',branch:'Hagea',totalBalance:'50 SAR',status:'Active', selected: false },
      { id: '646464160', vehicleModel: 'FIAT', plate: '342- KSA', driverName: 'Abram', driverPhone:'+966513865',petrolType:'55',branch:'Riyad',totalBalance:'50 SAR ',status:'Active', selected: false },
      { id: '646464161', vehicleModel: 'MG', plate: '512- KSA', driverName: 'Hassan',driverPhone:'+9672213122',petrolType:'62',branch:'El Safa',totalBalance:'50 SAR',status:'Active', selected: false },
    ]
  };

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
}
