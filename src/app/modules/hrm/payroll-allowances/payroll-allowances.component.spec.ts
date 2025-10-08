import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollAllowancesComponent } from './payroll-allowances.component';

describe('PayrollAllowancesComponent', () => {
  let component: PayrollAllowancesComponent;
  let fixture: ComponentFixture<PayrollAllowancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollAllowancesComponent]
    });
    fixture = TestBed.createComponent(PayrollAllowancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
