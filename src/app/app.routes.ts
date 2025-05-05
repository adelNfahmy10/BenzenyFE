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
  {
    path: '',
    loadComponent: () => import('./layout/auth/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [logedGuard],
    title: 'login',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./layout/auth/login/login.component').then(m => m.LoginComponent), title: 'Login' },
      { path: 'register', loadComponent: () => import('./layout/auth/registar/registar.component').then(m => m.RegistarComponent), title: 'Register' },
      { path: 'contiuneRegistar/:companyId', loadComponent: () => import('./layout/auth/registar/continueregistar/continueregistar.component').then(m => m.ContinueregistarComponent), title: 'Register' },
      { path: 'registeruser/:userId', loadComponent: () => import('./layout/auth/registeruser/registeruser.component').then(m => m.RegisteruserComponent), title: 'Register' },
    ]
  },
  {
    path: '',
    loadComponent: () => import('./layout/blanck/blanck/blanck.component').then(m => m.BlanckComponent),
    canActivate: [authGuard],
    title: 'home',
    children: [
      { path: 'benzeny-dashboard', loadComponent: () => import('./layout/blanck/benzeny-dashboard/benzeny-dashboard.component').then(m => m.BenzenyDashboardComponent), title: 'Benzeny | Dashboard' },
      { path: 'benzeny-companies', loadComponent: () => import('./layout/blanck/benzeny-companies/benzeny-companies.component').then(m => m.BenzenyCompaniesComponent), title: 'Benzeny | Companies' },
      { path: 'company-details/:id', loadComponent: () => import('./layout/blanck/benzeny-companies/compnay-details/compnay-details.component').then(m => m.CompnayDetailsComponent), title: 'Benzeny | Companies-Details' },
      { path: 'home', loadComponent: () => import('./layout/blanck/dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'Home' },
      { path: 'company', loadComponent: () => import('./layout/blanck/companies/companies.component').then(m => m.CompaniesComponent), title: 'Company' },
      { path: 'users', loadComponent: () => import('./layout/blanck/companies/users/users.component').then(m => m.UsersComponent), title: 'Users' },
      { path: 'branch', loadComponent: () => import('./layout/blanck/branches/branches.component').then(m => m.BranchesComponent), title: 'Branches' },
      { path: 'details/:id', loadComponent: () => import('./layout/blanck/branches/branchdetails/branchdetails.component').then(m => m.BranchdetailsComponent), title: 'Branch' },
      { path: 'balance', loadComponent: () => import('./layout/blanck/balance/balance.component').then(m => m.BalanceComponent), title: 'Balance' },
      { path: 'cars', loadComponent: () => import('./layout/blanck/cars/cars.component').then(m => m.CarsComponent), title: 'Cars' },
      { path: 'drivers', loadComponent: () => import('./layout/blanck/drivers/drivers.component').then(m => m.DriversComponent), title: 'Drivers' },
      { path: 'petrolstation', loadComponent: () => import('./layout/blanck/petrolstation/petrolstation.component').then(m => m.PetrolstationComponent), title: 'Petrol Stations' },
      { path: 'analytics', loadComponent: () => import('./layout/blanck/analytics/analytics.component').then(m => m.AnalyticsComponent), title: 'Analytics' },
      { path: 'ads', loadComponent: () => import('./layout/blanck/ads/ads.component').then(m => m.AdsComponent), title: 'ADS' },
      { path: 'management', loadComponent: () => import('./layout/blanck/management/management.component').then(m => m.ManagementComponent), title: 'Management' },
      { path: 'setting', loadComponent: () => import('./layout/blanck/settings/settings.component').then(m => m.SettingsComponent), title: 'Setting' },
      { path: 'footer', loadComponent: () => import('./layout/blanck/footer/footer.component').then(m => m.FooterComponent), title: 'Footer' },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./layout/blanck/notfound/notfound.component').then(m => m.NotfoundComponent),
    title: 'Not Found'
  }
];
