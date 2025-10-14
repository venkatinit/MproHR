import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaTaskAssignComponent } from './ca-task-assign.component';

describe('CaTaskAssignComponent', () => {
  let component: CaTaskAssignComponent;
  let fixture: ComponentFixture<CaTaskAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaTaskAssignComponent]
    });
    fixture = TestBed.createComponent(CaTaskAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
