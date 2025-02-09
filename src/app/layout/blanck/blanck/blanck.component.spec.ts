import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanckComponent } from './blanck.component';

describe('BlanckComponent', () => {
  let component: BlanckComponent;
  let fixture: ComponentFixture<BlanckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlanckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlanckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
