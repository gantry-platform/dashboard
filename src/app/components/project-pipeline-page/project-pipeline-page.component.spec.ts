import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPipelinePageComponent } from './project-pipeline-page.component';

describe('ProjectPipelinePageComponent', () => {
  let component: ProjectPipelinePageComponent;
  let fixture: ComponentFixture<ProjectPipelinePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPipelinePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPipelinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
