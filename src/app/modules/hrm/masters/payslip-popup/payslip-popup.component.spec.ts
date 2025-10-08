import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipPopupComponent } from './payslip-popup.component';

describe('PayslipPopupComponent', () => {
  let component: PayslipPopupComponent;
  let fixture: ComponentFixture<PayslipPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayslipPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayslipPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
