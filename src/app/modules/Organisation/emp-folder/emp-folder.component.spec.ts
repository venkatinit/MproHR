import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFolderComponent } from './emp-folder.component';

describe('EmpFolderComponent', () => {
  let component: EmpFolderComponent;
  let fixture: ComponentFixture<EmpFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpFolderComponent]
    });
    fixture = TestBed.createComponent(EmpFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
