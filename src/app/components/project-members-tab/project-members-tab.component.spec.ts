import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersTabComponent } from './project-members-tab.component';

describe('ProjectMembersTabComponent', () => {
  let component: ProjectMembersTabComponent;
  let fixture: ComponentFixture<ProjectMembersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMembersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
