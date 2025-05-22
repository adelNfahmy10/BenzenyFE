import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../../assets/share/header/header.component";
import { AdsService } from './core/ads.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, NgClass],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent implements OnInit{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AdsService = inject(AdsService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly _ToastrService = inject(ToastrService)

  userId: WritableSignal<string> = signal(localStorage.getItem('userId') || '');
  role: WritableSignal<string> = signal(localStorage.getItem('role') || '');
  allAds: WritableSignal<any[]> = signal([]);
  selectedFile: WritableSignal<File | null> = signal(null);

  ngOnInit(): void {
    this.getAllAds()
  }

  getAllAds():void{
    this._AdsService.GetAllAds().subscribe({
      next: (res) => {
        this.allAds.set(res.data);
      }
    });
  }

  adsForm:FormGroup = this._FormBuilder.group({
    Name:[],
    Image:[],
    Url:[],
    Description:[],
    Type:[1],
    DurationInMonths:[],
    IsActive :[true],
    CreatedBy:[],

  })

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.selectedFile.set(input.files[0]);
  }

  submitAdsForm():void{
    let data = this.adsForm.value;
    let formData = new FormData();

    formData.append('Name', data.Name);
    formData.append('Image', this.selectedFile()!);
    formData.append('Url', data.Url);
    formData.append('Description', data.Description);
    formData.append('Type', data.Type);
    formData.append('DurationInMonths', data.DurationInMonths);
    formData.append('IsActive', data.IsActive);
    formData.append('CreatedBy', this.userId()!);

    this._AdsService.CreateNewAds(formData).subscribe({
      next: (res) => {
        this._ToastrService.success(res.msg);
        this.getAllAds();
        this.adsForm.reset();
      }
    });
  }

  deleteAds(id:any):void{
    this._AdsService.SoftDeleteAds(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.msg);
        this.getAllAds();
      }
    });
  }

  switchActiveAds(adsId:string):void{
    this._AdsService.SwitchActiveAds(adsId).subscribe({
      next: (res) => {
        this._ToastrService.success(res.msg);
        this.getAllAds();
      }
    });
  }
}
