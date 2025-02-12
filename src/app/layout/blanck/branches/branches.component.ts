import { isPlatformBrowser, NgClass, NgFor } from '@angular/common';
import { Component, ElementRef, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxPaginationModule } from 'ngx-pagination';
import { BranchService } from './core/service/branch.service';
import * as XLSX from 'xlsx';
import { HeaderComponent } from "../../../../assets/share/header/header.component";


@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [NgFor, FormsModule, NgxPaginationModule, ReactiveFormsModule, NgClass, HeaderComponent],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent {
  /* Injection Services */
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _BranchService = inject(BranchService)
  private readonly _FormBuilder = inject(FormBuilder)

  page = 1;

  /* DATA Table Branches */
  data:any[] = [
    { id: '8', branchName: 'Makka', region: 'Makka', vehicles: '25',drivers:'18',iban:'SA123214231432412341235421',station:'a',petrolType:'s'},
    { id: '9', branchName: 'Makka', region: 'Makka', vehicles: '62',drivers:'79',iban:'SA12321423543624352335421',station:'a',petrolType:'s'},
    { id: '10', branchName: 'Makka', region: 'Makka', vehicles: '93',drivers:'20',iban:'SA123214a12352351321435421',station:'a',petrolType:'s'},
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

  // filterBranachList:any[] = []
  // filterByName(event:any){
  //   let searchValue = event.target.value.toLowerCase()
  //   if(searchValue){
  //     console.log(searchValue);
  //     this.filterBranachList = this.data.filter(name=>
  //       name.branchName.toLowerCase().includes(searchValue)
  //     )
  //     console.log(this.filterBranachList);

  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }
  // filterByRegion(event:any){
  //   let searchValue = event.target.value.toLowerCase()

  //   if(searchValue){
  //     this.filterBranachList = this.data.filter(region=>
  //       region.region.toLowerCase().includes(searchValue)
  //     )
  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }
  // filterByVehicles(event:any){
  //   let searchValue = event.target.value.toLowerCase()

  //   if(searchValue){
  //     this.filterBranachList = this.data.filter(vehicle=>
  //       vehicle.vehicles.toLowerCase().includes(searchValue)
  //     )
  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }
  // filterByDrivers(event:any){
  //   let searchValue = event.target.value.toLowerCase()

  //   if(searchValue){
  //     this.filterBranachList = this.data.filter(driver=>
  //       driver.drivers.toLowerCase().includes(searchValue)
  //     )
  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }
  // filterByIBAN(event:any){
  //   let searchValue = event.target.value.toLowerCase()

  //   if(searchValue){
  //     this.filterBranachList = this.data.filter(iban=>
  //       iban.iban.toLowerCase().includes(searchValue)
  //     )
  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }
  // filterByStation(event:any){
  //   let searchValue = event.target.value.toLowerCase()

  //   if(searchValue){
  //     this.filterBranachList = this.data.filter(station=>
  //       station.station.toLowerCase().includes(searchValue)
  //     )
  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }
  // filterByPetrolType(event:any){
  //   let searchValue = event.target.value.toLowerCase()

  //   if(searchValue){
  //     this.filterBranachList = this.data.filter(petrolType=>
  //       petrolType.petrolType.toLowerCase().includes(searchValue)
  //     )
  //   } else {
  //     this.filterBranachList = [...this.data]
  //   }
  // }

  onCompanyChange(event:Event):void{
    let selectId = (event.target as HTMLSelectElement).value
    console.log(selectId);
  }

  branchForm:FormGroup = this._FormBuilder.group({
    title:[''],
    regionId:[''],
    companyId:[''],
    packageId:[''],
    iban:[''],
    balance:[''],
    isMainBranch:[true],
  })

  submitBranchForm():void{
    let data = this.branchForm.value
    console.log(data);
    // this._BranchService.CreateBranch(data).subscribe({
    //   next:(res)=>{
    //     console.log(res);
    //   }
    // })
  }

  /* Download Table With PDF */
  open:boolean = false
  openList():void{
    if(this.open){
      this.open = false
      console.log(this.open);

    } else {
      this.open = true
      console.log(this.open);
    }
  }


  @ViewChild('table') template!:ElementRef
  downloadPDF():void{
    if(isPlatformBrowser(this._PLATFORM_ID)){
      const data = this.template.nativeElement

      html2canvas(data).then(canvas => {
        const imgWidth = 208
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const heightLeft = imgHeight
        const pdf = new jsPDF('p', 'mm', 'a4');
        const contentDataURL = canvas.toDataURL('image/png')
        pdf.addImage(contentDataURL, 'png', 0, 0, imgWidth, imgHeight)
        pdf.save('table.pdf')
      })
    }
  }

  downloadExcel():void{
    // Create a workbook and sheet from the HTML table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.template.nativeElement);

    // Create a new workbook with the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to Excel file
    XLSX.writeFile(wb, 'table_data.xlsx'); // Download the file as 'table_data.xlsx'
  }
}
