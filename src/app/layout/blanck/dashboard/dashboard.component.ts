import { Component, inject, OnInit } from '@angular/core';
import { ApexOptions } from 'apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent{
  public chartOptions: ApexOptions = {
    chart: {
      type: "line",
    },
    series: [
      {
        name: "sales",
        data: [1, 2, 3, 4, 5]
      }
    ]
  };

}
