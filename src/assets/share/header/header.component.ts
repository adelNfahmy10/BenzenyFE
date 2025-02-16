import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent{
  companyName:string | null = localStorage.getItem('companyName')
  userName:string | null = localStorage.getItem('userName')
}
