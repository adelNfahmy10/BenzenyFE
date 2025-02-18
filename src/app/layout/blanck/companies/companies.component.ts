import { Component, ElementRef, inject, OnInit, PLATFORM_ID, RendererFactory2, signal, ViewChild, WritableSignal } from '@angular/core';
import { Chart , registerables } from 'chart.js';
import { ViewallComponent } from "../../../../assets/share/buttons/viewall/viewall.component";
import { BtnaddComponent } from "../../../../assets/share/buttons/btnadd/btnadd.component";
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { BranchService } from '../branches/core/service/branch.service';
import { ReigonandcityService } from '../../../../core/services/reigons/reigonandcity.service';
Chart.register(...registerables)

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ViewallComponent, BtnaddComponent, RouterLink, FormsModule, HeaderComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ReigonandcityService = inject(ReigonandcityService)

  companyName:string | null = localStorage.getItem('companyName')
  allBranches:WritableSignal<any[]> = signal([])
  companyId:string | null = localStorage.getItem("companyId")
  allRegions:any[] = []
  allCity:any[] = []

  ngOnInit(): void {
    this.getAllBranches()
    this.getAllRegions()
  }

  getAllBranches():void{
    this._BranchService.GetAllBranchs().subscribe({
      next:(res)=>{
        this.allBranches.set(res.data.items)
      }
    })
  }
  onRegionsChange(event:Event):void{
    let selectId = (event.target as HTMLSelectElement).value
    this.getCityByRegion(selectId)
  }
  getAllRegions():void{
    this._ReigonandcityService.GetAllRegions().subscribe({
      next:(res)=>{
        this.allRegions = res.data.items
      }
    })
  }
  getCityByRegion(regionId:string):void{
    this._ReigonandcityService.GetCityByRegionId(regionId).subscribe({
      next:(res)=>{
        this.allCity = res
      }
    })
  }
  branchForm:FormGroup = this._FormBuilder.group({
    CompanyId:[''],
    RegionId:[''],
    CityId:[''],
    Address:[''],
    FullName:[''],
    Email:[''],
    Password:[''],
    PhoneNumber:[''],
    IBAN:[''],
  })
  submitBranchForm():void{
    let data = this.branchForm.value
    data.CompanyId = this.companyId
    let formData = new FormData()
    formData.append('CompanyId', data.CompanyId),
    formData.append('RegionId', data.RegionId),
    formData.append('CityId', data.CityId),
    formData.append('Address', data.Address),
    formData.append('FullName', data.FullName),
    formData.append('Email', data.Email),
    formData.append('Password', data.Password),
    formData.append('PhoneNumber', data.PhoneNumber),
    formData.append('IBAN', data.IBAN)

    this._BranchService.CreateBranch(formData).subscribe({
      next:(res)=>{
        this.getAllBranches()
      }
    })

  }


  selectedRowId: number | null = null;

  toggleMenu(rowId: number) {
    if (this.selectedRowId === rowId) {
      this.selectedRowId = null;
    } else {
      this.selectedRowId = rowId;
    }
  }

  isChecked:boolean = false
  toggleChecked():void{
    if(this.isChecked){
      this.isChecked = false
    } else {
      this.isChecked = true
    }
  }

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
