import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaTicketsComponent } from './ca-tickets.component';

describe('CaTicketsComponent', () => {
  let component: CaTicketsComponent;
  let fixture: ComponentFixture<CaTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaTicketsComponent]
    });
    fixture = TestBed.createComponent(CaTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
