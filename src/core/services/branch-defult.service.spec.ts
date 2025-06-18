import { TestBed } from '@angular/core/testing';

import { BranchDefultService } from './branch-defult.service';

describe('BranchDefultService', () => {
  let service: BranchDefultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchDefultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
