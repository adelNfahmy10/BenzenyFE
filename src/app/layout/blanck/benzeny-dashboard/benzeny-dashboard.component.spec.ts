import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenzenyDashboardComponent } from './benzeny-dashboard.component';

describe('BenzenyDashboardComponent', () => {
  let component: BenzenyDashboardComponent;
  let fixture: ComponentFixture<BenzenyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenzenyDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BenzenyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
