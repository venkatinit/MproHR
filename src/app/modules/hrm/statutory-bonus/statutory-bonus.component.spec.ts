import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryBonusComponent } from './statutory-bonus.component';

describe('StatutoryBonusComponent', () => {
  let component: StatutoryBonusComponent;
  let fixture: ComponentFixture<StatutoryBonusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatutoryBonusComponent]
    });
    fixture = TestBed.createComponent(StatutoryBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
