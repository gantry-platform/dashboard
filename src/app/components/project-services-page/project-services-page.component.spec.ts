import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectServicesPageComponent } from './project-services-page.component';

describe('ProjectServicesPageComponent', () => {
  let component: ProjectServicesPageComponent;
  let fixture: ComponentFixture<ProjectServicesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectServicesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
