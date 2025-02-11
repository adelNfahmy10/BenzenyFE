import { Component } from '@angular/core';
import { TableComponent } from '../../../../assets/share/table/table.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [FormsModule, TableComponent, HeaderComponent],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent {
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
}
