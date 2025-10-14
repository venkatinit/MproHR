import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCompanyEmployeeComponent } from './ca-company-employee.component';

describe('CaCompanyEmployeeComponent', () => {
  let component: CaCompanyEmployeeComponent;
  let fixture: ComponentFixture<CaCompanyEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaCompanyEmployeeComponent]
    });
    fixture = TestBed.createComponent(CaCompanyEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
