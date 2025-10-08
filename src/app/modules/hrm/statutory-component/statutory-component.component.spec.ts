import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryComponentComponent } from './statutory-component.component';

describe('StatutoryComponentComponent', () => {
  let component: StatutoryComponentComponent;
  let fixture: ComponentFixture<StatutoryComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatutoryComponentComponent]
    });
    fixture = TestBed.createComponent(StatutoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
