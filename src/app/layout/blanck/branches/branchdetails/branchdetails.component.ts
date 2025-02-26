import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../../cars/core/service/car.service';
import { DriverService } from '../../drivers/core/service/driver.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { BranchService } from '../core/service/branch.service';

@Component({
  selector: 'app-branchdetails',
  standalone: true,
  imports: [NgxPaginationModule, DatePipe],
  templateUrl: './branchdetails.component.html',
  styleUrl: './branchdetails.component.scss'
})
export class BranchdetailsComponent implements OnInit{
  private readonly _CarService = inject(CarService)
  private readonly _DriverService = inject(DriverService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  branchId:string | null = null
  companyId:string | null = null
  allCars:any[] = []
  driverBranch:any[] = []
  carCount:any = 0
  allPage:any = 0
  currentPage:any = 0
  pageSize:any = 0
  carsCount:any = 0
  driversCount:any = 0

  constructor(){
    this.companyId = localStorage.getItem('companyId')
  }

  ngOnInit(): void {
    this.getBranchById()
  }

  getBranchById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.branchId = params.get('id')
        this.getAllCars()
        this.getAllDrivers()
      }
    })
  }

  getAllCars():void{
    this._CarService.GetAllCarsByBranchId(this.branchId).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
        this.carCount = res.data.totalCount
        this.allPage = Math.ceil(res.data.totalCount / res.data.pageSize)
        this.currentPage = res.data.pageNumber
        this.pageSize = res.data.pageSize
      }
    })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this._CarService.GetAllCarsByBranchId(this.branchId, '' , page).subscribe({
      next:(res)=>{
        this.allCars = res.data.items
      }
    })
  }

  getAllDrivers():void{
    this._DriverService.GetDriversInBranch(this.branchId).subscribe({
      next:(res)=>{
        this.driverBranch = res.data.items
        this.driversCount = res.data.totalCount
      }
    })
  }

  onChangePageSize(event:Event):void{
    let pageSize = (event.target as HTMLSelectElement).value
    this._CarService.GetAllCarsByBranchId(this.branchId, '' , 1, pageSize).subscribe({
      next:(res)=>{
        this.pageSize = pageSize
        this.allCars = res.data.items
      }
    })
  }
}
