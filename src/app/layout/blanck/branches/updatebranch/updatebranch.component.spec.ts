import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatebranchComponent } from './updatebranch.component';

describe('UpdatebranchComponent', () => {
  let component: UpdatebranchComponent;
  let fixture: ComponentFixture<UpdatebranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatebranchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatebranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
