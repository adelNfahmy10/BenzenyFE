import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, ElementRef, inject, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { CompanyService } from '../core/service/company.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../../../../assets/share/header/header.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsersService } from '../core/service/users.service';
import { RolesService } from '../../../../../core/services/roles.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgxPaginationModule, ReactiveFormsModule, NgClass, HeaderComponent, NgSelectModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
 /* Injection Services */
 private readonly _FormBuilder = inject(FormBuilder)
 private readonly _PLATFORM_ID = inject(PLATFORM_ID)
 private readonly _CompanyService = inject(CompanyService)
 private readonly _UsersService = inject(UsersService)
 private readonly _RolesService = inject(RolesService)
 private readonly _ActivatedRoute = inject(ActivatedRoute)
 private readonly _ToastrService = inject(ToastrService)

 /* All Properties */
 companyId: WritableSignal<string> = signal(localStorage.getItem('companyId') || '');
 allUsers: WritableSignal<any[]> = signal([]);
 allRoles: WritableSignal<any[]> = signal([]);
 userCount: WritableSignal<number> = signal(0);
 userId: WritableSignal<string> = signal('');
 activeCount: WritableSignal<number> = signal(0);
 disActiveCount: WritableSignal<number> = signal(0);
 allPage: WritableSignal<number> = signal(1);
 currentPage: WritableSignal<number> = signal(1);
 pageSize: WritableSignal<number> = signal(10);
 selectedRoles: WritableSignal<string[]> = signal([]);


 /* OnInit Function */
 ngOnInit(): void {
   this.getAllUsers()
   this.getAllRoles()
 }

 /* All Users */
 getAllUsers():void{
  this._CompanyService.GetAllUserInCompanyById(this.companyId()).subscribe({
    next: (res) => {
      this.allUsers.set(res.data.items);
      this.userCount.set(res.data.totalCount);
      this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
      this.currentPage.set(res.data.pageNumber);
      this.pageSize.set(res.data.pageSize);
      this.activeCount.set(res.data.activeCount);
      this.disActiveCount.set(res.data.inActiveCount);
    }
  });
 }

 getAllRoles():void{
  this._RolesService.getAllRoles().subscribe({
    next: (res) => {
      // this.allRoles.set(res.data);
      this.allRoles.set(res.data.filter((role: any) => role.name !== "Benzeny"));
    }
  });
 }

 toggleRoleSelection(role: any, event: any) {
    if (event.target.checked) {
      this.selectedRoles.update(roles => [...roles, role.name]);
    } else {
      this.selectedRoles.update(roles => roles.filter(r => r !== role.name));
    }
  }

 /* User Form */
  userForm:FormGroup = this._FormBuilder.group({
   CompanyId:[''],
   fullName:[''],
   email:[''],
   mobile:[''],
   roles: this._FormBuilder.array([]),
  })

 /* Submit User Form */
 submitUserForm():void{
  let data = this.userForm.value;
  data.CompanyId = this.companyId();
  data.roles = this.selectedRoles();

  this._UsersService.addUser(data).subscribe({
    next: (res) => {
      this.getAllUsers();
      this.userForm.reset();
      this.selectedRoles.set([]);
      this._ToastrService.success(res.msg);
    }
  });
 }

 /* Delete User */
DeleteUserInCompany(userId:string):void{
  this._CompanyService.DeleteUserInCompany(this.companyId()!, userId).subscribe({
    next: (res) => {
      this._ToastrService.error(res.msg);
      this.getAllUsers();
    }
  });
}

UpdateUserForm:FormGroup = this._FormBuilder.group({
  id:[''],
  companyId:[''],
  fullName:[''],
  email:[''],
  mobile:[''],
  userRoles: this._FormBuilder.array([]),
})

getUserDataById(userId:string):void{
  this.userId.set(userId);
  this._UsersService.getUserById(userId).subscribe({
    next: (res) => {
      let user = res.data;
      this.UpdateUserForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile
      });
    }
  });
}

submitUpdateUser():void{
  let data = this.UpdateUserForm.value;
  data.id = this.userId();
  data.companyId = this.companyId();
  data.userRoles = this.selectedRoles();

  this._UsersService.updateUser(this.userId(), data).subscribe({
    next: (res) => {
      this.getAllUsers();
      this.UpdateUserForm.reset();
      this.selectedRoles.set([]);
    }
  });
}

 /* Switch Active Users */
 switchActiveUser(userId:string):void{
  this._UsersService.SwitchActiveUser(userId).subscribe({
    next: (res) => {
      this._ToastrService.success(res.msg);
      this.getAllUsers();
    }
  });
}

 // Filtering the data based on search input
 filteredData(event:Event) {
  const searchTerm = (event.target as HTMLInputElement).value;
  this._CompanyService.GetAllUserInCompanyById(this.companyId(), searchTerm).subscribe({
    next: (res) => {
      this.allUsers.set(res.data.items);
    }
  });
 }

 /* Sort Table */
 sortColumn: WritableSignal<string> = signal('');
 sortDirection: WritableSignal<boolean> = signal(true);
 sortTable(column: string): void {
  if (this.sortColumn() === column) {
    this.sortDirection.set(!this.sortDirection());
  } else {
    this.sortColumn.set(column);
    this.sortDirection.set(true);
  }

  this.allUsers.update(users =>
    [...users].sort((a, b) => {
      if (a[column] > b[column]) {
        return this.sortDirection() ? 1 : -1;
      } else if (a[column] < b[column]) {
        return this.sortDirection() ? -1 : 1;
      } else {
        return 0;
      }
    })
  );
}

 // Pagnation Pages
 onPageChange(page: number): void {
   this.currentPage.set(page)
   this.changePagePagination(page);
 }

 changePagePagination(page:number):void{
   this._CompanyService.GetAllUserInCompanyById(this.companyId(), '' , page).subscribe({
     next:(res)=>{
      this.allUsers = res.data.items
     }
   })
 }

 onChangePageSize(event:Event):void{
   let pageSize = +(event.target as HTMLSelectElement).value
   this._CompanyService.GetAllUserInCompanyById(this.companyId(), '' , 1, pageSize).subscribe({
     next:(res)=>{
       this.pageSize.set(pageSize)
       this.allUsers = res.data.items
     }
   })
 }

 @ViewChild('table') template!:ElementRef
 downloadPDF():void{
   if(isPlatformBrowser(this._PLATFORM_ID)){
     const data = this.template.nativeElement
     html2canvas(data).then(canvas => {
       const imgWidth = 208
       const pageHeight = 295
       const imgHeight = (canvas.height * imgWidth) / canvas.width
       const heightLeft = imgHeight
       const pdf = new jsPDF('p', 'mm', 'a4');
       const contentDataURL = canvas.toDataURL('image/png')
       pdf.addImage(contentDataURL, 'png', 0, 0, imgWidth, imgHeight)
       pdf.save('table.pdf')
     })
   }
 }

 downloadExcel():void{
   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.template.nativeElement);
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   XLSX.writeFile(wb, 'table_data.xlsx');
 }

}
