import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisePoshComponent } from './raise-posh.component';

describe('RaisePoshComponent', () => {
  let component: RaisePoshComponent;
  let fixture: ComponentFixture<RaisePoshComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaisePoshComponent]
    });
    fixture = TestBed.createComponent(RaisePoshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
