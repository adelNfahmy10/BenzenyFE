import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { TableComponent } from '../../../../assets/share/table/table.component';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [HeaderComponent, TableComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  chart:any;

  public config:any = {
    type: 'line',
    data: {
      labels:['JAN', 'FEB', 'MAR', 'APR'],
        datasets: [
          {
            label:'Sales',
            data: [100 ,200, 400, 600],
            borderColor: '#F79320',
            backgroundColor:'#F79320',
            // fill: true,
          },
      ]
    },
    options: {
      responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
  };

  ngOnInit(): void {
    this.chart = new Chart('MyChart', this.config)
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
}
