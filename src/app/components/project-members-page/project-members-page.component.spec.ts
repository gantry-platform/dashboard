import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersPageComponent } from './project-members-page.component';

describe('ProjectMembersPageComponent', () => {
  let component: ProjectMembersPageComponent;
  let fixture: ComponentFixture<ProjectMembersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMembersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
