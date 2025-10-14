import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgTicketsComponent } from './org-tickets.component';

describe('OrgTicketsComponent', () => {
  let component: OrgTicketsComponent;
  let fixture: ComponentFixture<OrgTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgTicketsComponent]
    });
    fixture = TestBed.createComponent(OrgTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
