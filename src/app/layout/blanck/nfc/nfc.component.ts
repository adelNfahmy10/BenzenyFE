import { Component } from '@angular/core';
import { TableComponent } from "../../../../assets/share/table/table.component";
import { HeaderComponent } from "../../../../assets/share/header/header.component";

@Component({
  selector: 'app-nfc',
  standalone: true,
  imports: [TableComponent, HeaderComponent],
  templateUrl: './nfc.component.html',
  styleUrl: './nfc.component.scss'
})
export class NfcComponent {
 role:any = localStorage.getItem('role')
  data:any[] = []
  ngOnInit(): void {
  if(this.role == 'Super Admin'){
    this.data = [
        { id: '646464156', company: 'MARCID', NFC : 'wd31w234feasd42314g23',status:'Active', selected: false },
        { id: '646464157', company: 'MARC', NFC : 'wd31w234feasd42314g23',status:'Active', selected: false },
        { id: '646464158', company: 'BMW', NFC : 'wd31w234feasd42314g23',status:'Active', selected: false },
        { id: '646464159', company: 'SUZ', NFC : 'wd31w234feasd42314g23',status:'Active', selected: false },
        { id: '646464160', company: 'FIAT', NFC : 'wd31w234feasd42314g23', status:'Active', selected: false },
        { id: '646464161', company: 'MG', NFC : 'wd31w234feasd42314g23',status:'Active', selected: false },
    ]
  }

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

  if(this.role == 'Branch-Manager'){
    this.data = [
      { id: '646464156', Transactions: '597', selected: false },
      { id: '646464157', Transactions: '523', selected: false },
      { id: '646464158', Transactions: '755', selected: false },
      { id: '646464159', Transactions: '090', selected: false },
      { id: '646464160', Transactions: '342', selected: false },
      { id: '646464161', Transactions: '512', selected: false },
    ]
  }
  }
}
