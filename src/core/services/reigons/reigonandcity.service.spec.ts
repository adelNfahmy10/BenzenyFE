import { TestBed } from '@angular/core/testing';

import { ReigonandcityService } from './reigonandcity.service';

describe('ReigonandcityService', () => {
  let service: ReigonandcityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReigonandcityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
