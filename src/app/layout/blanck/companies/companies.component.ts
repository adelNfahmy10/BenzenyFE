import { Component } from '@angular/core';
import { Chart , registerables } from 'chart.js';
import { ViewallComponent } from "../../../../assets/share/buttons/viewall/viewall.component";
import { BtnaddComponent } from "../../../../assets/share/buttons/btnadd/btnadd.component";
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables)

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ViewallComponent, BtnaddComponent, RouterLink, NgFor, FormsModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
  data:any[] = [
    { id: '10', branchName: 'Makka', region: 'Makka', vehicles: '25',drivers:'18',iban:'SA123214231432412341235421',station:'a',petrolType:'s'},
    { id: '11', branchName: 'Riyadh', region: 'Riyadh', vehicles: '32',drivers:'20',iban:'SA12354362643523452345152',station:'a',petrolType:'s'},
    { id: '12', branchName: 'Dammam', region: 'Eastern', vehicles: '53',drivers:'9',iban:'SA43123134253412341235421',station:'a',petrolType:'s'},
    { id: '13', branchName: 'Abha', region: 'Asir', vehicles: '12',drivers:'6',iban:'SA123223451234123441235421',station:'a',petrolType:'s'},
    { id: '14', branchName: 'Tabuk', region: 'Tabuk', vehicles: '67',drivers:'14',iban:'SA97565637546346254352325',station:'a',petrolType:'s'},
    { id: '15', branchName: 'Medina', region: 'Madina', vehicles: '18',drivers:'32',iban:'SA2364372454365234515112',station:'a',petrolType:'s'},
  ]

  filterText = '';
  get filteredData() {
    return this.data.filter(row =>
      Object.values(row).some((value:any) => value.toString().toLowerCase().includes(this.filterText.toLowerCase()))
    );
  }
}
