import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blanck',
  standalone: true,
  imports: [RouterOutlet, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './blanck.component.html',
  styleUrl: './blanck.component.scss'
})
export class BlanckComponent {
  private readonly _Router = inject(Router)
  open:Boolean = true

  slideNav():void{
    if(this.open){
      this.open = false
    } else {
      this.open = true
    }
  }

  logout():void{
    localStorage.clear()
    this._Router.navigate(['login'])
  }
}
