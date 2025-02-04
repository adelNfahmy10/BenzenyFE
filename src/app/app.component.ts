import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/blanck/navbar/navbar.component';
import { FooterComponent } from './layout/blanck/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
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
