import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpfoComponent } from './epfo.component';

describe('EpfoComponent', () => {
  let component: EpfoComponent;
  let fixture: ComponentFixture<EpfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpfoComponent]
    });
    fixture = TestBed.createComponent(EpfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
