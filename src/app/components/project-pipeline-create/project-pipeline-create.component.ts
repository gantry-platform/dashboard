import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-pipeline-create',
  templateUrl: './project-pipeline-create.component.html',
  styleUrls: ['./project-pipeline-create.component.scss']
})
export class ProjectPipelineCreateComponent implements OnInit {

  @Input()  data: any;
  @Output() result = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.result.next(false);
  }

  save(): void {
    this.result.next(true);
  }

}
