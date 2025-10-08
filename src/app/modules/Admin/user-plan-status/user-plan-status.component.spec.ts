import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlanStatusComponent } from './user-plan-status.component';

describe('UserPlanStatusComponent', () => {
  let component: UserPlanStatusComponent;
  let fixture: ComponentFixture<UserPlanStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPlanStatusComponent]
    });
    fixture = TestBed.createComponent(UserPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
