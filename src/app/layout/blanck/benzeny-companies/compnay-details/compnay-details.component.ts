import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CompanyService } from '../../companies/core/service/company.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { single } from 'rxjs';
import { HeaderComponent } from "../../../../../assets/share/header/header.component";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { BranchService } from '../../branches/core/service/branch.service';

@Component({
  selector: 'app-compnay-details',
  standalone: true,
  imports: [ HeaderComponent, NgxPaginationModule, NgxDropzoneModule, RouterLink],
  templateUrl: './compnay-details.component.html',
  styleUrl: './compnay-details.component.scss'
})
export class CompnayDetailsComponent implements OnInit {
  private readonly _CompanyService = inject(CompanyService)
  private readonly _BranchService = inject(BranchService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  companyId:WritableSignal<string | null> = signal('')
  companyData:any = ''
  allBranches:WritableSignal<any[]> = signal([])
  allPage: WritableSignal<number> = signal(1);
  currentPage: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(1);
  selectAll: WritableSignal<boolean> = signal(false);
  branchCount: WritableSignal<string> = signal('');
  files: WritableSignal<File[]> = signal([]);
  sortColumn: WritableSignal<string> = signal('');
  sortDirection: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.getCompanyById()
    this.getAllBranchesByCompanyId()
  }

  getCompanyById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(param)=>{
        this.companyId.set(param.get('id'))
        this._CompanyService.GetCompanyById(this.companyId()).subscribe({
          next:(res)=>{
            this.companyData = res.data
          }
        })
      }
    })
  }

  getAllBranchesByCompanyId(pageNum = 1,pageSize = 10){
    this._BranchService.GetAllBranchesInCompany(this.companyId(), "" , pageNum, pageSize).subscribe({
      next:(res)=>{
        this.allBranches.set(res.data.items[0].branchs);
        this.branchCount.set(res.data.totalCount);
        this.allPage.set(Math.ceil(res.data.totalCount / res.data.pageSize));
        this.currentPage.set(res.data.pageNumber);
        this.pageSize.set(res.data.pageSize);
      }
    })
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.changePagePagination(page);
  }

  changePagePagination(page:number):void{
    this.getAllBranchesByCompanyId(page)
  }

  onChangePageSize(event:Event):void{
    let pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllBranchesByCompanyId(1 , pageSize)
  }

  // Filtering the data based on search input
  filteredData(event:Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this._CompanyService.GetAllCompanies(searchTerm).subscribe({
      next: (res) => {
        this.allBranches.set(res.data.items);
      }
    });
  }

  /* Sort Table */
  sortTable(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(!this.sortDirection());
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(true);
    }

    this.allBranches.update(branches =>
      [...branches].sort((a, b) => {
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
}
