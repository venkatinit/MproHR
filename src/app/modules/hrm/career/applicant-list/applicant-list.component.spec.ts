import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantListComponent } from './applicant-list.component';

describe('ApplicantListComponent', () => {
  let component: ApplicantListComponent;
  let fixture: ComponentFixture<ApplicantListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantListComponent]
    });
    fixture = TestBed.createComponent(ApplicantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
