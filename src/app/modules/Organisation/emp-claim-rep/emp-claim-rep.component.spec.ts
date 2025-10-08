import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpClaimRepComponent } from './emp-claim-rep.component';

describe('EmpClaimRepComponent', () => {
  let component: EmpClaimRepComponent;
  let fixture: ComponentFixture<EmpClaimRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpClaimRepComponent]
    });
    fixture = TestBed.createComponent(EmpClaimRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
