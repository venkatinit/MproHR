import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLocationComponent } from './work-location.component';

describe('WorkLocationComponent', () => {
  let component: WorkLocationComponent;
  let fixture: ComponentFixture<WorkLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkLocationComponent]
    });
    fixture = TestBed.createComponent(WorkLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
