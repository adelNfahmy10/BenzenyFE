import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BranchDefultService {
  private branchIdSignal = signal<string | null>(localStorage.getItem('branchId'));
  readonly branchId = this.branchIdSignal;

  setBranchId(id: string): void {
    localStorage.setItem('branchId', id);
    this.branchIdSignal.set(id);
  }
}
