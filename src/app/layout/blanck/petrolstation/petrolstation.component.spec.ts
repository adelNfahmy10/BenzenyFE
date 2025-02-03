import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetrolstationComponent } from './petrolstation.component';

describe('PetrolstationComponent', () => {
  let component: PetrolstationComponent;
  let fixture: ComponentFixture<PetrolstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetrolstationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetrolstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
