import { Routes } from '@angular/router';
import { NavbarComponent } from './layout/blanck/navbar/navbar.component';
import { DashboardComponent } from './layout/blanck/dashboard/dashboard.component';
import { FooterComponent } from './layout/blanck/footer/footer.component';
import { NotfoundComponent } from './layout/blanck/notfound/notfound.component';
import { BalanceComponent } from './layout/blanck/balance/balance.component';
import { CompaniesComponent } from './layout/blanck/companies/companies.component';
import { PetrolstationComponent } from './layout/blanck/petrolstation/petrolstation.component';
import { SettingsComponent } from './layout/blanck/settings/settings.component';
import { CarsComponent } from './layout/blanck/cars/cars.component';
import { AnalyticsComponent } from './layout/blanck/analytics/analytics.component';
import { ManagementComponent } from './layout/blanck/management/management.component';

export const routes: Routes = [
    {path:'',redirectTo:'home', pathMatch:'full'},
    {path:'home', component:DashboardComponent, title:'Home'},
    {path:'company', component:CompaniesComponent, title:'Company'},
    {path:'balance', component:BalanceComponent, title:'Balance'},
    {path:'cars', component:CarsComponent, title:'Cars'},
    {path:'petrolstation', component:PetrolstationComponent, title:'Petrol Stations'},
    {path:'analytics', component:AnalyticsComponent, title:'analyics'},
    {path:'management', component:ManagementComponent, title:'Management'},
    {path:'setting', component:SettingsComponent, title:'Setting'},
    {path:'footer', component:FooterComponent, title:'footer'},
    {path:'**', component:NotfoundComponent, title:'notfound'},
];
