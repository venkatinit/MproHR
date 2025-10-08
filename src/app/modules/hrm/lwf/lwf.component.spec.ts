import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LwfComponent } from './lwf.component';

describe('LwfComponent', () => {
  let component: LwfComponent;
  let fixture: ComponentFixture<LwfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LwfComponent]
    });
    fixture = TestBed.createComponent(LwfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
