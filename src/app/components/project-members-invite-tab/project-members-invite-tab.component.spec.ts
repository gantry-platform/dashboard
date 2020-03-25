import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersInviteTabComponent } from './project-members-invite-tab.component';

describe('ProjectMembersInviteTabComponent', () => {
  let component: ProjectMembersInviteTabComponent;
  let fixture: ComponentFixture<ProjectMembersInviteTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMembersInviteTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersInviteTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
