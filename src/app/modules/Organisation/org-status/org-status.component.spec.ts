import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgStatusComponent } from './org-status.component';

describe('OrgStatusComponent', () => {
  let component: OrgStatusComponent;
  let fixture: ComponentFixture<OrgStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgStatusComponent]
    });
    fixture = TestBed.createComponent(OrgStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
