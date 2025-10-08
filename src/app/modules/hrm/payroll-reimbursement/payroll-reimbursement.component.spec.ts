import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollReimbursementComponent } from './payroll-reimbursement.component';

describe('PayrollReimbursementComponent', () => {
  let component: PayrollReimbursementComponent;
  let fixture: ComponentFixture<PayrollReimbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollReimbursementComponent]
    });
    fixture = TestBed.createComponent(PayrollReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
