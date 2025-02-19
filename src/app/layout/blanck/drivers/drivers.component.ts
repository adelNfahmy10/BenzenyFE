import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../assets/share/table/table.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { DriverService } from './core/service/driver.service';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [FormsModule, TableComponent, HeaderComponent, ReactiveFormsModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _DriverService = inject(DriverService)

  branchId:string | null = localStorage.getItem('branchId')
  allDrivers:any[] = []

  ngOnInit(): void {
    this.getAllDrivers()
  }

  getAllDrivers():void{
    this._DriverService.GetAllDrivers(this.branchId).subscribe({
      next:(res)=>{
        this.allDrivers = res.data.items
        console.log(this.allDrivers);
      }
    })
  }

  driverForm:FormGroup = this._FormBuilder.group({
    branchId:[''],
    fullName:[''],
    phoneNumber:[''],
    license:[''],
    licenseDegree:['']
  })

  submitDriverForm():void{
    let data = this.driverForm.value
    data.branchId = this.branchId
    this._DriverService.CreateDriver(data).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }

  DeleteDriver(id:string):void{
    this._DriverService.DeleteDriver(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.getAllDrivers()
      }
    })
  }


  data = {
    title:'Drivers',
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

  isChecked:boolean = false
  toggleChecked():void{
    if(this.isChecked){
      this.isChecked = false
    } else {
      this.isChecked = true
    }
  }

}
