import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink ,RouterLinkActive ,NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  open:Boolean = true

  slideNav():void{
    if(this.open){
      this.open = false
    } else {
      this.open = true
    }
  }

}
