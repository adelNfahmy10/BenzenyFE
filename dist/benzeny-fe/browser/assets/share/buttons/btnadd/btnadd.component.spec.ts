import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnaddComponent } from './btnadd.component';

describe('BtnaddComponent', () => {
  let component: BtnaddComponent;
  let fixture: ComponentFixture<BtnaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
