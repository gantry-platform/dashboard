import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPipelineCreateComponent } from './project-pipeline-create.component';

describe('ProjectPipelineCreateComponent', () => {
  let component: ProjectPipelineCreateComponent;
  let fixture: ComponentFixture<ProjectPipelineCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPipelineCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPipelineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
