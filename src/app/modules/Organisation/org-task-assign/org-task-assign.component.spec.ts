import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgTaskAssignComponent } from './org-task-assign.component';

describe('OrgTaskAssignComponent', () => {
  let component: OrgTaskAssignComponent;
  let fixture: ComponentFixture<OrgTaskAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgTaskAssignComponent]
    });
    fixture = TestBed.createComponent(OrgTaskAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
