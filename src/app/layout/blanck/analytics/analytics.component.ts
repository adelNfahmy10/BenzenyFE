import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js'
import { HeaderComponent } from "../../../../assets/share/header/header.component";
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [HeaderComponent],
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

}
