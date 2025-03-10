import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CompanyService } from '../companies/core/service/company.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, CarouselModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit{
  private readonly _ToastrService = inject(ToastrService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _CompanyService = inject(CompanyService)

  companyName:string = ''
  companyId:string = ''
  companyData:any = {}
  edit:boolean = true

  constructor(){
    this.companyName = localStorage.getItem('companyName')!
    this.companyId = localStorage.getItem('companyId')!
  }

  ngOnInit(): void {
    // this.chartLine = new Chart('ChartLine', this.configLine)
    this.chartBar = new Chart('ChartBar', this.configBar)
    this.chartBin = new Chart('ChartBin', this.configBin)
    this.getCompanyById()
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

  getCompanyById():void{
    this._CompanyService.GetCompanyById(this.companyId).subscribe({
      next:(res)=>{
        this.companyData = res.data
        console.log(this.companyData);
      }
    })
  }

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

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay:true,
    autoplayHoverPause:true,
    autoplayTimeout:3000,
    dots: false,
    navSpeed: 700,
    items:1,
    nav: false
  }

  enableFormFields() {
    if (this.edit) {
      this.companyForm.enable();
      this.edit = false
    } else {
      this.companyForm.disable();
      this.edit = true
    }
  }

  companyForm: FormGroup = this._FormBuilder.group({
    Id: [{ value: '', disabled: true }],
    Name: [{ value: '', disabled: true }],
    Description: [{ value: '', disabled: true }],
    CompanyEmail: [{ value: '', disabled: true }],
    CompanyPhone: [{ value: '', disabled: true }],
    Vat: [{ value: '', disabled: true }],
  });

  updateCompany():void{
    let data = this.companyForm.value
    console.log(data);
  }

  /* Copy ID And IBAN */
  @ViewChild('ibanBranach') elementIbanBrnach!:ElementRef
  copyIban(iban: string): void {
    if (!iban || iban === 'Soon') {
      this._ToastrService.warning('No IBAN available to copy');
      return;
    }
    navigator.clipboard.writeText(iban)
    .then(() => {
      this._ToastrService.success('IBAN Copied To Clipboard');
    })
    .catch(() => {
      this._ToastrService.error('Failed To Copy IBAN');
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
}
