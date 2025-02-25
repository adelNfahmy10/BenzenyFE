import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueregistarComponent } from './continueregistar.component';

describe('ContinueregistarComponent', () => {
  let component: ContinueregistarComponent;
  let fixture: ComponentFixture<ContinueregistarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinueregistarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContinueregistarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
