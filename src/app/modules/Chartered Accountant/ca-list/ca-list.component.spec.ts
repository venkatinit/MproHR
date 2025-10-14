import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaListComponent } from './ca-list.component';

describe('CaListComponent', () => {
  let component: CaListComponent;
  let fixture: ComponentFixture<CaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaListComponent]
    });
    fixture = TestBed.createComponent(CaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
