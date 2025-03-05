import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CarouselModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit{
  private readonly _ToastrService = inject(ToastrService)
  companyName:string | null = null
  constructor(){
    this.companyName = localStorage.getItem('companyName')
  }

  ngOnInit(): void {
    // this.chartLine = new Chart('ChartLine', this.configLine)
    this.chartBar = new Chart('ChartBar', this.configBar)
    this.chartBin = new Chart('ChartBin', this.configBin)
  }
  // chartLine:any;
  // public configLine:any = {
  //   type: 'line',
  //   data: {
  //     labels:['Sun', 'Mon', 'Tue', 'Wed', 'Fri','Sat'],
  //       datasets: [
  //         {
  //           label:'Sales',
  //           data: [100 ,200, 400, 600],
  //           borderColor: '#F79320',
  //           backgroundColor:'#F79320',
  //           // fill: true,
  //         },
  //     ]
  //   },
  //   options: {
  //     animations: {
  //       tension: {
  //         duration: 1000,
  //         easing: 'linear',
  //         from: 1,
  //         to: 0,
  //         loop: true
  //       }
  //     },
  //     responsive: true,
  //       scales: {
  //           y: {
  //               beginAtZero: true
  //           }
  //       }
  //   },
  // };

  chartBar:any;
  public configBar:any = {
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
          backgroundColor:['#F97C21', '#ADB2D4', '#C599B6', '#7B7B7B', '#D3E671', '#003092', '#A31D1D', '#4C7B8B'],
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

  chartBin:any;
  public configBin:any = {
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

  /* Copy ID And IBAN */
  @ViewChild('Iban') elementIban!:ElementRef
  @ViewChild('ibanBranach') elementIbanBrnach!:ElementRef
  copyIban():void{
    const textCopy = this.elementIban.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('IBAN Copied To Clipboard')
    })
    .catch((err) => {
      this._ToastrService.success('Failed To Copy IBAN')
    });
  }
  copyIbanBranches():void{
    const textCopy = this.elementIbanBrnach.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('IBAN Branch Copied To Clipboard','Success',{
        positionClass:'toast-bottom-right',
      })
    })
    .catch((err) => {
      this._ToastrService.success('Failed To Copy IBAN Branch')
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    // responsive: {
    //   0: {
    //     items: 1
    //   },
    //   400: {
    //     items: 2
    //   },
    //   740: {
    //     items: 3
    //   },
    //   940: {
    //     items: 4
    //   }
    // },
    nav: true
  }

}
