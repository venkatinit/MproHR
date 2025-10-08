import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavetypesComponent } from './leavetypes.component';

describe('LeavetypesComponent', () => {
  let component: LeavetypesComponent;
  let fixture: ComponentFixture<LeavetypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavetypesComponent]
    });
    fixture = TestBed.createComponent(LeavetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
