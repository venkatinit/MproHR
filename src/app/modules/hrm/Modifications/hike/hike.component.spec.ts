import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HikeComponent } from './hike.component';

describe('HikeComponent', () => {
  let component: HikeComponent;
  let fixture: ComponentFixture<HikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HikeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
