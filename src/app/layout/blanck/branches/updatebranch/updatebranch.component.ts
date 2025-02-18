import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BranchService } from '../core/service/branch.service';
import { ReigonandcityService } from '../../../../../core/services/reigons/reigonandcity.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-updatebranch',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './updatebranch.component.html',
  styleUrl: './updatebranch.component.scss'
})
export class UpdatebranchComponent implements OnInit{
  /* Injection Services */
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _BranchService = inject(BranchService)
  private readonly _ReigonandcityService = inject(ReigonandcityService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  companyId:string | null = localStorage.getItem("companyId")
  allBrnaches:any[] = []
  allRegions:any[] = []
  allCity:any[] = []
  branch:any[] = []
  branchId:string = ''

  ngOnInit(): void {
    this.getBranchById()
    this.getAllRegions()
    this.getAllBranches()
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
  getBranchById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.branchId = params.get('id')!
        this._BranchService.GetBranchById(this.branchId).subscribe({
          next:(res)=>{
            this.branch = res.data
          }
        })
      }
    })
  }
  getAllBranches():void{
    this._BranchService.GetAllBranchs().subscribe({
      next:(res)=>{
        this.allBrnaches = res.data.items
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
  isChecked:boolean = false
  toggleChecked():void{
    if(this.isChecked){
      this.isChecked = false
    } else {
      this.isChecked = true
    }
  }
}
