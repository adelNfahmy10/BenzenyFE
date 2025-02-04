import { Component } from '@angular/core';
import { Chart , registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
  title = 'ng-chart';
  chart: any = [];
  
  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'scatter',
      data: {
        labels: ["2010-01-02 05:06:07","2010-01-03 05:06:07","2010-01-04 05:06:07","2010-01-05 05:06:07"],
        datasets: [{
          label: 'Transactions',
          data: [{
            x: "2010-01-01 05:06:07",
            y: 10
          }, {
            x: "2010-01-02 05:06:07",
            y: 5
          }, {
            x: "2010-01-03 05:06:07",
            y: 5.5
          }],
          backgroundColor: 'rgb(255, 99, 132)'
        },{
        data: [{
          x: "2010-01-04 05:06:07",
          y: 7
        }, {
          x: "2010-01-05 05:06:07",
          y: 7
        }, {
          x: "2010-01-06 05:06:07",
          y: 6.5
        }],
        backgroundColor: 'rgb(125, 99, 132)'
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
          x:{
            type: 'time'
          }
        }
      },
    });
  }
}
