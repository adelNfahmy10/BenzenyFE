import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenzenyCompaniesComponent } from './benzeny-companies.component';

describe('BenzenyCompaniesComponent', () => {
  let component: BenzenyCompaniesComponent;
  let fixture: ComponentFixture<BenzenyCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenzenyCompaniesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BenzenyCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
