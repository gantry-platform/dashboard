import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPodsPageComponent } from './project-pods-page.component';

describe('ProjectPodsPageComponent', () => {
  let component: ProjectPodsPageComponent;
  let fixture: ComponentFixture<ProjectPodsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPodsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPodsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
