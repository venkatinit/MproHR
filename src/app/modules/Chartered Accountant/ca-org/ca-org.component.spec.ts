import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaOrgComponent } from './ca-org.component';

describe('CaOrgComponent', () => {
  let component: CaOrgComponent;
  let fixture: ComponentFixture<CaOrgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaOrgComponent]
    });
    fixture = TestBed.createComponent(CaOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
