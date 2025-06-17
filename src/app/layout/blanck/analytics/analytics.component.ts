import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
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

  // data = {
  //   title:'Vehicles',
  //   items:[
  //     { id: '646464156', vehicleModel: 'KIA', plate: '597- KSA', driverName: 'Sayed',driverPhone:'+966513122',petrolType:'92',branch:'Madinah',totalBalance:'50 SAR',status:'Active', selected: false },
  //     { id: '646464157', vehicleModel: 'MARC', plate: '523- KSA', driverName: 'Eslam',driverPhone:'+96624123',petrolType:'72',branch:'Makkah',totalBalance:'50 SAR',status:'Active', selected: false },
  //     { id: '646464158', vehicleModel: 'BMW', plate: '755- KSA', driverName: 'Fawzi',driverPhone:'+966554121',petrolType:'83',branch:'El Taaef',totalBalance:'50 SAR',status:'Active', selected: false },
  //     { id: '646464159', vehicleModel: 'SUZ', plate: '090- KSA', driverName: 'Salman',driverPhone:'+96651562',petrolType:'24',branch:'Hagea',totalBalance:'50 SAR',status:'Active', selected: false },
  //     { id: '646464160', vehicleModel: 'FIAT', plate: '342- KSA', driverName: 'Abram', driverPhone:'+966513865',petrolType:'55',branch:'Riyad',totalBalance:'50 SAR ',status:'Active', selected: false },
  //     { id: '646464161', vehicleModel: 'MG', plate: '512- KSA', driverName: 'Hassan',driverPhone:'+9672213122',petrolType:'62',branch:'El Safa',totalBalance:'50 SAR',status:'Active', selected: false },
  //   ]
  // };

  data = [
    {
      company: 'Company A',
      branch: 'Branch 1',
      car: 'Car X',
      driver: 'Driver A',
      transaction: 'TX001',
      station: 'Station Alpha',
      balance: 1500,
      fromDate: '2024-06-01',
      toDate: '2024-06-17'
    },
    {
      company: 'Company B',
      branch: 'Branch 2',
      car: 'Car Y',
      driver: 'Driver B',
      transaction: 'TX002',
      station: 'Station Beta',
      balance: 2200,
      fromDate: '2021-09-22',
      toDate: '2025-11-30'
    },
    {
      company: 'Company B',
      branch: 'Branch 3',
      car: 'Car Z',
      driver: 'Driver B',
      transaction: 'TX002',
      station: 'Station Beta',
      balance: 2200,
      fromDate: '2022-05-01',
      toDate: '2024-09-30'
    },
    {
      company: 'Company A',
      branch: 'Branch 5',
      car: 'Car F',
      driver: 'Driver A',
      transaction: 'TX001',
      station: 'Station Alpha',
      balance: 1500,
      fromDate: '2025-06-14',
      toDate: '2025-06-22'
    }
    // بيانات إضافية هنا
  ];

  filteredData = [...this.data];

  filters: any = {
    company: '',
    branch: '',
    car: '',
    driver: '',
    transaction: '',
    station: '',
    balance: '',
    fromDate: '',
    toDate: ''
  };

  sortDirection: 'asc' | 'desc' = 'asc';
  currentSortKey: string = '';

  applyFilters(): void {
    this.filteredData = this.data.filter(item => {
    const itemFromDate = new Date(item.fromDate);
    const itemToDate = new Date(item.toDate);
    const filterFromDate = this.filters.fromDate ? new Date(this.filters.fromDate) : null;
    const filterToDate = this.filters.toDate ? new Date(this.filters.toDate) : null;

    return (
      (!this.filters.company || item.company.toLowerCase().includes(this.filters.company.toLowerCase())) &&
      (!this.filters.branch || item.branch.toLowerCase().includes(this.filters.branch.toLowerCase())) &&
      (!this.filters.car || item.car.toLowerCase().includes(this.filters.car.toLowerCase())) &&
      (!this.filters.driver || item.driver.toLowerCase().includes(this.filters.driver.toLowerCase())) &&
      (!this.filters.transaction || item.transaction.toLowerCase().includes(this.filters.transaction.toLowerCase())) &&
      (!this.filters.station || item.station.toLowerCase().includes(this.filters.station.toLowerCase())) &&
      (!this.filters.balance || item.balance.toString().includes(this.filters.balance.toString())) &&
      (!filterFromDate || itemFromDate >= filterFromDate) &&
      (!filterToDate || itemToDate <= filterToDate)
    );
  });

  if (this.currentSortKey) {
    this.sortData(this.currentSortKey, true);
  }
  }

  sortData(key: string, keepDirection: boolean = false): void {
    if (!keepDirection) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    this.currentSortKey = key;

    this.filteredData.sort((a: any, b: any) => {
      const valA = a[key];
      const valB = b[key];

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  resetFilter():void{
    this.filters = {
      company: '',
      branch: '',
      car: '',
      driver: '',
      transaction: '',
      station: '',
      balance: '',
      fromDate: '',
      toDate: ''
    };

    this.filteredData = [...this.data];
    this.currentSortKey = '';
    this.sortDirection = 'asc';
  }

}
