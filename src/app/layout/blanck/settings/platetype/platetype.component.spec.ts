import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatetypeComponent } from './platetype.component';

describe('PlatetypeComponent', () => {
  let component: PlatetypeComponent;
  let fixture: ComponentFixture<PlatetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatetypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlatetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
