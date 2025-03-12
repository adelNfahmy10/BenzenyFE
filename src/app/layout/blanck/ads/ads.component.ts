import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../assets/share/header/header.component";

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {
  ads:any[] = [
    {title:'Pizza', description:'Hawaiian pizza with ham and pineapple', image:'../../../../assets/image/ads-img/ads1.webp'},
    {title:'Levitation pizza', description:'Levitation pizza on black background.', image:'../../../../assets/image/ads-img/ads2.webp'},
    {title:'Beef steaks', description:'Tasty beef steaks flying above cast iron grate with fire flames.', image:'../../../../assets/image/ads-img/ads3.webp'},
    {title:'Lyulya kebab', description:'Tender and juicy skewers of ground lamb or beef, flavored with aromatic spices and herbs', image:'../../../../assets/image/ads-img/ads4.webp'},
  ]



}
