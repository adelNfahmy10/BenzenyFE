import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit{
  ngOnInit(): void {
    this.chartLine = new Chart('ChartLine', this.configLine)
    this.chartBar = new Chart('ChartBar', this.configBar)
    this.chartBin = new Chart('ChartBin', this.configBin)
  }
  chartLine:any;
  public configLine:any = {
    type: 'line',
    data: {
      labels:['Sun', 'Mon', 'Tue', 'Wed', 'Fri','Sat'],
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

  chartBar:any;
  public configBar:any = {
    type: 'bar',
    data: {
      labels:['JAN', 'FEB', 'MAR', 'APR'],
      datasets: [
        {
          label:'Sales',
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
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

  chartBin:any;
  public configBin:any = {
    type: 'doughnut',
    data: {
      labels: [
        '#7B7B7B',
        '#DCDCDC',
        '#F1F1F1',
        '#F97C21'
      ],
      datasets: [
        {
          label:'Sales',
          data: [100 ,200, 400, 600],
          backgroundColor: [
            '#7B7B7B',
            '#DCDCDC',
            '#F1F1F1',
            '#F97C21'
          ],
          hoverOffset: 3,
          borderWidth: 5,
          borderRadius:10
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
      cutout:'60%',
    },
  };


}
