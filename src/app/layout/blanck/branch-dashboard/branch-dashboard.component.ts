import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, WritableSignal, ViewChild, ElementRef, OnInit, Signal, computed, effect } from '@angular/core';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { Chart, registerables } from 'chart.js';
import { CompanyService } from '../companies/core/service/company.service';
import { CarService } from '../cars/core/service/car.service';
import { BranchDefultService } from '../../../../core/services/branch-defult.service';
Chart.register(...registerables);

@Component({
  selector: 'app-branch-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './branch-dashboard.component.html',
  styleUrl: './branch-dashboard.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BranchDashboardComponent implements OnInit{
  private readonly _CompanyService = inject(CompanyService)
  private readonly _BranchDefultService = inject(BranchDefultService)
  private readonly _CarService = inject(CarService)

  // branchId: WritableSignal<string> = signal(localStorage.getItem('branchId') || '');
  branchId: Signal<string> = computed( () => this._BranchDefultService.branchId()! )
  carCount: WritableSignal<number> = signal(0);


  constructor(){
      effect(() => {
        const id = this._BranchDefultService.branchId();
        if (id) {
          console.log('Branch ID changed:', id);
          this.getAllCars();
        }
      });
    }
  // Run Charts And Funtions When Project Load
  ngOnInit(): void {
    // this.chartLine = new Chart('ChartLine', this.configLine)
    this.chartBarTransactions = new Chart('chartBarTransactions', this.configBarTrans);
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

  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId()).subscribe({
      next: (res) => {
        this.carCount.set(res.data.totalCount);
      }
    });
  }


  // Charts Transaction Options
  chartBarTransactions:any;
  public configBarTrans:any = {
    type: 'bar',
    data: {
      labels:['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG'],
      datasets: [
        {
          label:['Total Fuel Consumed (L/month)'],
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

  // Charts Fuel Options
  chartLineFuel:any;
  public configLineFuel:any = {
    type: 'line',
    data: {
      labels:['Sun', 'Mon', 'Tue', 'Wed', 'Fri','Sat'],
        datasets: [
          {
            label:'Fuel Budget',
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
