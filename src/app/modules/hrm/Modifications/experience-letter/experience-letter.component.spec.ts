import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceLetterComponent } from './experience-letter.component';

describe('ExperienceLetterComponent', () => {
  let component: ExperienceLetterComponent;
  let fixture: ComponentFixture<ExperienceLetterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceLetterComponent]
    });
    fixture = TestBed.createComponent(ExperienceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
