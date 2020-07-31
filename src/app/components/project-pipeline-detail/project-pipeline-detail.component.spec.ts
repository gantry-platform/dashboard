import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPipelineDetailComponent } from './project-pipeline-detail.component';

describe('ProjectPipelineDetailComponent', () => {
  let component: ProjectPipelineDetailComponent;
  let fixture: ComponentFixture<ProjectPipelineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPipelineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPipelineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
