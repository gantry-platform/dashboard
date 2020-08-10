import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

enum SourceType {
  git = 'Git',
  image = 'Docker Image'
}

@Component({
  selector: 'app-project-pipeline-create',
  templateUrl: './project-pipeline-create.component.html',
  styleUrls: ['./project-pipeline-create.component.scss']
})
export class ProjectPipelineCreateComponent implements OnInit {

  @Output() result = new EventEmitter<boolean>();
  SourceTypeDeclaredInComponent = SourceType;
  form: FormGroup;
  sourceTypes: Array<String> = [SourceType.git, SourceType.image];
  currentSourceType: string;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      pipelineName: ['', Validators.required],
      sourceType: ['', Validators.required],
      applicationName: ['', Validators.required]
    });
  }

  initGitForm(): void {
    this.form = this.fb.group({
      pipelineName: ['', Validators.required],
      sourceType: [SourceType.git, Validators.required]
    });
  }

  initDockerImageForm(): void {
    this.form = this.fb.group({
      pipelineName: ['', Validators.required],
      sourceType: [SourceType.image, Validators.required]
    });
  }

  resetForm(): void {
    this.form = null;
  }

  selectionChangeSourceType(type: string): void {
    this.currentSourceType = type;
    this.resetForm();

    if(this.currentSourceType == SourceType.git) {
      this.initGitForm();

    } else if(this.currentSourceType == SourceType.image) {
      this.initDockerImageForm();
    } else {
      this.initForm();
    }

    console.log(this.form.value);
  }

  cancel(): void {
    this.result.next(false);
  }

  save(): void {
    this.result.next(true);
  }

}
