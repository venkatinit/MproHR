import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSubscriptionComponent } from './org-subscription.component';

describe('OrgSubscriptionComponent', () => {
  let component: OrgSubscriptionComponent;
  let fixture: ComponentFixture<OrgSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgSubscriptionComponent]
    });
    fixture = TestBed.createComponent(OrgSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
