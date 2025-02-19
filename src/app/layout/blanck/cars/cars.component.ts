import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from "../../../../assets/share/table/table.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import * as XLSX from 'xlsx';
import { CarService } from './core/service/car.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [FormsModule, TableComponent, HeaderComponent, ReactiveFormsModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CarService = inject(CarService)

  allCars:any[] = []
  branchId:string | null = localStorage.getItem('branchId')

  ngOnInit(): void {
    this.getAllCars()
  }

  getAllCars():void{
    this._CarService.GetAllCars(this.branchId).subscribe({
      next:(res)=>{
        this.allCars = res
        console.log(this.allCars);
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
    driversId:[''],
  })

  submitCarForm():void{
    let data = this.carForm.value
    data.branchId = this.branchId
    data.cardNum = data.model
    data.driversId = [this.branchId]

    let formData = new FormData()
    formData.append('branchId', data.branchId)
    formData.append('model', data.model)
    formData.append('carNumber', data.carNumber)
    formData.append('color', data.color)
    formData.append('cardNum', data.cardNum)
    formData.append('licenseDate', data.licenseDate)
    formData.append('driversId', data.driversId)
    this._CarService.CreateCar(data).subscribe({
      next:(res)=>{
        this.getAllCars()
      }
    })
  }

  DeleteCar(id:string):void{
    this._CarService.DeleteCar(id).subscribe({
      next:(res)=>{
        this.getAllCars()
      }
    })
  }






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


  isChecked:boolean = false
  toggleChecked():void{
    if(this.isChecked){
      this.isChecked = false
    } else {
      this.isChecked = true
    }
  }

}
