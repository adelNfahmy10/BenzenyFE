import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/core/service/auth.service';
import { Router } from 'express';

@Component({
  selector: 'app-blanck',
  standalone: true,
  imports: [RouterOutlet, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './blanck.component.html',
  styleUrl: './blanck.component.scss'
})
export class BlanckComponent {
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)
  open:Boolean = true

  slideNav():void{
    if(this.open){
      this.open = false
    } else {
      this.open = true
    }
  }
}
