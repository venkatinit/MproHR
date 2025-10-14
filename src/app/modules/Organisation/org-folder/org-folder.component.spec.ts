import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgFolderComponent } from './org-folder.component';

describe('OrgFolderComponent', () => {
  let component: OrgFolderComponent;
  let fixture: ComponentFixture<OrgFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgFolderComponent]
    });
    fixture = TestBed.createComponent(OrgFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
