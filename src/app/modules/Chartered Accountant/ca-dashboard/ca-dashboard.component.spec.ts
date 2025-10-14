import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardComponent } from './ca-dashboard.component';

describe('CaDashboardComponent', () => {
  let component: CaDashboardComponent;
  let fixture: ComponentFixture<CaDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaDashboardComponent]
    });
    fixture = TestBed.createComponent(CaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
