import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPipelineListComponent } from './project-pipeline-list.component';

describe('ProjectPipelineListComponent', () => {
  let component: ProjectPipelineListComponent;
  let fixture: ComponentFixture<ProjectPipelineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPipelineListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPipelineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
