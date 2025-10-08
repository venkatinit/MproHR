import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLoginPageComponent } from './company-login-page.component';

describe('CompanyLoginPageComponent', () => {
  let component: CompanyLoginPageComponent;
  let fixture: ComponentFixture<CompanyLoginPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyLoginPageComponent]
    });
    fixture = TestBed.createComponent(CompanyLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
