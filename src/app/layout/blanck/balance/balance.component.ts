import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { TableComponent } from "../../../../assets/share/table/table.component";

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [FormsModule, HeaderComponent, TableComponent],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent implements OnInit{
  role:any = localStorage.getItem('role')
  data:any[] = []
  ngOnInit(): void {
    if(this.role == 'CompanyOwner'){
      this.data = [
          { id: '646464156', Branch: 'Bra', IBAN : '31234325214231423', Amount: '597',status:'Active', selected: false },
          { id: '646464157', Branch: 'MARC', IBAN : '31234325214231423', Amount: '523',status:'Active', selected: false },
          { id: '646464158', Branch: 'BMW', IBAN : '31234325214231423', Amount: '755',status:'Active', selected: false },
          { id: '646464159', Branch: 'SUZ', IBAN : '31234325214231423', Amount: '090',status:'Active', selected: false },
          { id: '646464160', Branch: 'FIAT', IBAN : '31234325214231423', Amount: '342', status:'Active', selected: false },
          { id: '646464161', Branch: 'MG', IBAN : '31234325214231423', Amount: '512',status:'Active', selected: false },
      ]
    }

  if(this.role == 'Super Admin'){
    this.data = [
        { id: '646464156', company: 'MARCID', IBAN : '31234325214231423', Amount: '597',status:'Active', selected: false },
        { id: '646464157', company: 'MARC', IBAN : '31234325214231423', Amount: '523',status:'Active', selected: false },
        { id: '646464158', company: 'BMW', IBAN : '31234325214231423', Amount: '755',status:'Active', selected: false },
        { id: '646464159', company: 'SUZ', IBAN : '31234325214231423', Amount: '090',status:'Active', selected: false },
        { id: '646464160', company: 'FIAT', IBAN : '31234325214231423', Amount: '342', status:'Active', selected: false },
        { id: '646464161', company: 'MG', IBAN : '31234325214231423', Amount: '512',status:'Active', selected: false },
    ]
  }

  if(this.role == 'Branch-Manager'){
    this.data = [
          { id: '646464156', Amount: '597', Type: 'Fuel', Date: '14, April 2025', balance: '40 SAR',selected: false },
          { id: '646464157', Amount: '523', Type: 'Fuel', Date: '18, May 2025', balance: '32 SAR',selected: false },
          { id: '646464158', Amount: '755', Type: 'Oil', Date: '22, May 2025', balance: '62 SAR',selected: false },
          { id: '646464159', Amount: '090', Type: 'Wash', Date: '5, June 2025', balance: '30 SAR',selected: false },
          { id: '646464160', Amount: '342', Type: 'Fuel', Date: '17, June 2025', balance: '72 SAR',selected: false },
          { id: '646464161', Amount: '512', Type: 'Wash', Date: '30, July 2025', balance: '14 SAR',selected: false },
      ]
    }
  }
}
