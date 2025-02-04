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
  public config:any = {
    type: 'bar',
    data:{

    }
  }
}
