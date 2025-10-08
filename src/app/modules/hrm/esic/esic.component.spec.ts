import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicComponent } from './esic.component';

describe('EsicComponent', () => {
  let component: EsicComponent;
  let fixture: ComponentFixture<EsicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsicComponent]
    });
    fixture = TestBed.createComponent(EsicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
