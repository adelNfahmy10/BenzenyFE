import { Routes } from '@angular/router';
import { NavbarComponent } from './layout/blanck/navbar/navbar.component';
import { DashboardComponent } from './layout/blanck/dashboard/dashboard.component';
import { FooterComponent } from './layout/blanck/footer/footer.component';
import { NotfoundComponent } from './layout/blanck/notfound/notfound.component';

export const routes: Routes = [
    {path:'',redirectTo:'dashboard', pathMatch:'full'},
    {path:'navbar', component:NavbarComponent, title:'Navbar'},
    {path:'dashboard', component:DashboardComponent, title:'dashboard'},
    {path:'footer', component:FooterComponent, title:'footer'},
    {path:'**', component:NotfoundComponent, title:'notfound'},
];
