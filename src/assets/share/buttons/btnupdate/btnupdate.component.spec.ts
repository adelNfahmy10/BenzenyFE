import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnupdateComponent } from './btnupdate.component';

describe('BtnupdateComponent', () => {
  let component: BtnupdateComponent;
  let fixture: ComponentFixture<BtnupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnupdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
