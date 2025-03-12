import { LoginComponent } from './layout/auth/login/login.component';
import { Routes } from '@angular/router';
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
import { AuthComponent } from './layout/auth/auth/auth.component';
import { RegistarComponent } from './layout/auth/registar/registar.component';
import { BlanckComponent } from './layout/blanck/blanck/blanck.component';
import { DriversComponent } from './layout/blanck/drivers/drivers.component';
import { BranchesComponent } from './layout/blanck/branches/branches.component';
import { BranchdetailsComponent } from './layout/blanck/branches/branchdetails/branchdetails.component';
import { logedGuard } from '../core/guards/loged.guard';
import { authGuard } from '../core/guards/auth.guard';
import { ContinueregistarComponent } from './layout/auth/registar/continueregistar/continueregistar.component';
import { RegisteruserComponent } from './layout/auth/registeruser/registeruser.component';
import { UsersComponent } from './layout/blanck/companies/users/users.component';
import { AdsComponent } from './layout/blanck/ads/ads.component';

export const routes: Routes = [
  {path:'', component:AuthComponent, canActivate:[logedGuard] , title:'login', children:[
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component:LoginComponent, title:'Login'},
    {path:'register', component:RegistarComponent, title:'Register'},
    {path:'contiuneRegistar/:companyId', component:ContinueregistarComponent, title:'Register'},
    {path:'registeruser/:userId', component:RegisteruserComponent, title:'Register'},
  ]},

  {path:'', component:BlanckComponent, canActivate:[authGuard], title:'home', children:[
    {path:'home', component:DashboardComponent, title:'Home'},
    {path:'company', component:CompaniesComponent, title:'Company'},
    {path:'users', component:UsersComponent, title:'Users'},
    {path:'branch', component:BranchesComponent, title:'Branches'},
    {path:'details/:id', component:BranchdetailsComponent, title:'Branch'},
    {path:'balance', component:BalanceComponent, title:'Balance'},
    {path:'cars', component:CarsComponent, title:'Cars'},
    {path:'drivers', component:DriversComponent, title:'Drivers'},
    {path:'petrolstation', component:PetrolstationComponent, title:'Petrol Stations'},
    {path:'analytics', component:AnalyticsComponent, title:'analyics'},
    {path:'ads', component:AdsComponent, title:'ADS'},
    {path:'management', component:ManagementComponent, title:'Management'},
    {path:'setting', component:SettingsComponent, title:'Setting'},
    {path:'footer', component:FooterComponent, title:'footer'},
  ]},
  {path:'**', component:NotfoundComponent, title:'notfound'},
];
