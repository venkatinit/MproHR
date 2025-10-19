import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayCalenderComponent } from './holiday-calender.component';

describe('HolidayCalenderComponent', () => {
  let component: HolidayCalenderComponent;
  let fixture: ComponentFixture<HolidayCalenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidayCalenderComponent]
    });
    fixture = TestBed.createComponent(HolidayCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
