import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-pipeline-page',
  templateUrl: './project-pipeline-page.component.html',
  styleUrls: ['./project-pipeline-page.component.scss']
})
export class ProjectPipelinePageComponent implements OnInit {
  
  detailOpened = false;
  rowData: any = null;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  createPipeline(): void {
    this.detailOpened = true;    
  }

  outputPipelineList(data: any): void {
    console.log(data);
    this.rowData = data;
    this.detailOpened = true;
  }

  outputPipelineCreate(data: boolean): void {
    this.detailOpened = false;
    this.rowData = null;
  }

  outputPipelineDetail(data: boolean): void {
    this.detailOpened = false;
    this.rowData = null;
  }
}
