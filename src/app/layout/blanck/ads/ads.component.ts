import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { AdsService } from './core/ads.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AdsService = inject(AdsService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _ToastrService = inject(ToastrService)

  allAds:any[] = []
  selectedFile:File | null = null
  userId:string | null = null

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.userId = localStorage.getItem('userId')
    }
  }

  ngOnInit(): void {
    this.getAllAds()
  }

  getAllAds():void{
    this._AdsService.GetAllAds().subscribe({
      next:(res)=>{
        this.allAds = res.data
      }
    })
  }

  adsForm:FormGroup = this._FormBuilder.group({
    Name:[],
    Url:[],
    CreatedBy:[],
    Image:[],
  })

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.selectedFile = input.files[0];
  }

  submitAdsForm():void{
    let data = this.adsForm.value
    let formData = new FormData()

    formData.append('Name', data.Name)
    formData.append('CreatedBy', this.userId!)
    formData.append('Image', this.selectedFile!)

    this._AdsService.CreateNewAds(formData).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.getAllAds()
        this.adsForm.reset()
      }
    })
  }

  deleteAds(id:any):void{
    this._AdsService.SoftDeleteAds(id).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.getAllAds()
      }
    })
  }

  ads:any[] = [
    {title:'Pizza', description:'Hawaiian pizza with ham and pineapple', image:'../../../../assets/image/ads-img/ads1.webp'},
    {title:'Levitation pizza', description:'Levitation pizza on black background.', image:'../../../../assets/image/ads-img/ads2.webp'},
    {title:'Beef steaks', description:'Tasty beef steaks flying above cast iron grate with fire flames.', image:'../../../../assets/image/ads-img/ads3.webp'},
    {title:'Lyulya kebab', description:'Tender and juicy skewers of ground lamb or beef, flavored with aromatic spices and herbs', image:'../../../../assets/image/ads-img/ads4.webp'},
  ]
}
