import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-project-pipeline-detail',
  templateUrl: './project-pipeline-detail.component.html',
  styleUrls: ['./project-pipeline-detail.component.scss']
})
export class ProjectPipelineDetailComponent implements OnInit {

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
