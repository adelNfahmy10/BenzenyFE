import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { Chart, registerables } from 'chart.js';
import { CompanyService } from '../companies/core/service/company.service';
import { RouterLink } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-benzeny-dashboard',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './benzeny-dashboard.component.html',
  styleUrl: './benzeny-dashboard.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BenzenyDashboardComponent implements OnInit{
  private readonly _CompanyService = inject(CompanyService)

  // Run Charts And Funtions When Project Load
  ngOnInit(): void {
    // this.chartLine = new Chart('ChartLine', this.configLine)
    this.chartBarTransactions = new Chart('chartBarTransactions', this.configBarTrans);
    this.chartBarCompany = new Chart('chartBarCompany', this.configBarCompany);
    this.chartBinBalance = new Chart('chartBinBalance', this.configBinBalance);
    this.chartLineFuel = new Chart('chartLineFuel', this.configLineFuel);

    this.getallCompanies()
  }

  allCompanies: WritableSignal<any[]> = signal([]);
  companyCount: WritableSignal<string> = signal('');


  getallCompanies():void{
    this._CompanyService.GetAllCompanies().subscribe({
      next:(res)=>{
        this.allCompanies.set(res.data.items);
        this.companyCount.set(res.data.totalCount);
      }
    })
  }


  // Charts Transaction Options
  chartBarTransactions:any;
  public configBarTrans:any = {
    type: 'bar',
    data: {
      labels:['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG'],
      datasets: [
        {
          label:['Transactions'],
          barPercentage: 0.5,
          barThickness: 20,
          maxBarThickness: 25,
          minBarThickness: 10,
          minBarLength: 2,
          data: [100 ,200, 600, 130, 240, 60, 400, 570],
          borderColor: '#F79320',
          backgroundColor:['#F97C21'],
          borderRadius:10,
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

  // Charts Company Options
  chartBarCompany:any;
  public configBarCompany:any = {
    type: 'bar',
    data: {
      labels:['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG'],
      datasets: [
        {
          label:['Comppanies'],
          barPercentage: 0.5,
          barThickness: 20,
          maxBarThickness: 25,
          minBarThickness: 10,
          minBarLength: 2,
          data: [100 ,200, 600, 130, 240, 60, 400, 570],
          borderColor: '#F79320',
          backgroundColor:['#F97C21'],
          borderRadius:10,
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

  // Charts Balance Options
  chartBinBalance:any;
  public configBinBalance:any = {
    type: 'polarArea',
    data: {
      labels: [
        '#7B7B7B',
        '#DCDCDC',
        '#F1F1F1',
        '#F97C21'
      ],
      datasets: [
        {
          label:'Balance',
          data: [100 ,200, 400, 600],
          backgroundColor: [
            '#7B7B7B',
            '#ADB2D4',
            '#C599B6',
            '#F97C21'
          ],
          hoverOffset: 3,
        },
      ]
    },
    options: {
      responsive: true,
      scales: {
          y: {
            beginAtZero: true
          }
      },
    },
  };

  // Charts Fuel Options
  chartLineFuel:any;
  public configLineFuel:any = {
    type: 'line',
    data: {
      labels:['Sun', 'Mon', 'Tue', 'Wed', 'Fri','Sat'],
        datasets: [
          {
            label:'Sales',
            data: [100, 600, 400 ,500, 127, 423],
            borderColor: '#F79320',
            backgroundColor:'#F79320',
            // fill: true,
          },
      ]
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true
        }
      },
      responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
  };
}
