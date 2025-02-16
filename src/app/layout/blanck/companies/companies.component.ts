import { Component, ElementRef, inject, OnInit, PLATFORM_ID, RendererFactory2, ViewChild } from '@angular/core';
import { Chart , registerables } from 'chart.js';
import { ViewallComponent } from "../../../../assets/share/buttons/viewall/viewall.component";
import { BtnaddComponent } from "../../../../assets/share/buttons/btnadd/btnadd.component";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
Chart.register(...registerables)

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ViewallComponent, BtnaddComponent, RouterLink, FormsModule, HeaderComponent, RouterLink],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent{
  private readonly _ToastrService = inject(ToastrService)

  companyName:string | null = localStorage.getItem('companyName')

  /* Copy ID And IBAN */
  @ViewChild('Id') elementId!:ElementRef
  @ViewChild('Iban') elementIban!:ElementRef
  @ViewChild('ibanBranach') elementIbanBrnach!:ElementRef
  copyId():void{
    const textCopy = this.elementId.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('ID Copied To Clipboard','Success',{
        positionClass:'toast-bottom-right',
      })
    })
    .catch((err) => {
      this._ToastrService.success('Failed To Copy ID')
    });
  }
  copyIban():void{
    const textCopy = this.elementIban.nativeElement.innerText;
    navigator.clipboard.writeText(textCopy)
    .then(() => {
      this._ToastrService.success('IBAN Copied To Clipboard','Success',{
        positionClass:'toast-bottom-right',
      })
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
}
