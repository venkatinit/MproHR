import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDeductionsComponent } from './payroll-deductions.component';

describe('PayrollDeductionsComponent', () => {
  let component: PayrollDeductionsComponent;
  let fixture: ComponentFixture<PayrollDeductionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollDeductionsComponent]
    });
    fixture = TestBed.createComponent(PayrollDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
