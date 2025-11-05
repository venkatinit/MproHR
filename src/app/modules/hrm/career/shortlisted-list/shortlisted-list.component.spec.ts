import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistedListComponent } from './shortlisted-list.component';

describe('ShortlistedListComponent', () => {
  let component: ShortlistedListComponent;
  let fixture: ComponentFixture<ShortlistedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShortlistedListComponent]
    });
    fixture = TestBed.createComponent(ShortlistedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
