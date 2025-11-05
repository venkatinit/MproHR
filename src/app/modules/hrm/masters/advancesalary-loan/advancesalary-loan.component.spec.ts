import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancesalaryLoanComponent } from './advancesalary-loan.component';

describe('AdvancesalaryLoanComponent', () => {
  let component: AdvancesalaryLoanComponent;
  let fixture: ComponentFixture<AdvancesalaryLoanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancesalaryLoanComponent]
    });
    fixture = TestBed.createComponent(AdvancesalaryLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
