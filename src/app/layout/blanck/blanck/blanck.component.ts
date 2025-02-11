import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../../../assets/share/header/header.component";

@Component({
  selector: 'app-blanck',
  standalone: true,
  imports: [RouterOutlet, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './blanck.component.html',
  styleUrl: './blanck.component.scss'
})
export class BlanckComponent {
  open:Boolean = true

  slideNav():void{
    if(this.open){
      this.open = false
    } else {
      this.open = true
    }
  }
}
