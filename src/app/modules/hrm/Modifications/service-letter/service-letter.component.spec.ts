import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLetterComponent } from './service-letter.component';

describe('ServiceLetterComponent', () => {
  let component: ServiceLetterComponent;
  let fixture: ComponentFixture<ServiceLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
