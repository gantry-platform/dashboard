import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

interface Pipeline {
  name: string;
  type: string;
  repo: string;
  branch: string;
  runtime: string;
  latest_status: string;
}

@Component({
  selector: 'app-project-pipeline-list',
  templateUrl: './project-pipeline-list.component.html',
  styleUrls: ['./project-pipeline-list.component.scss']
})
export class ProjectPipelineListComponent implements OnInit {

  pipelineColumns: string[] = ['name', 'type', 'repo', 'branch', 'runtime', 'latest_status', 'action'];
  pipelineDataSource: MatTableDataSource<Pipeline> = new MatTableDataSource<Pipeline>([]);
  @Output() result = new EventEmitter<any>();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const pipelines: Array<Pipeline> = [
      { name: 'pipeline1', type: 'image', repo: 'na', branch: 'na', runtime: 'na', latest_status: 'success' },
      { name: 'pipeline2', type: 'image', repo: 'na', branch: 'na', runtime: 'na', latest_status: 'success' },
      { name: 'pipeline3', type: 'image', repo: 'na', branch: 'na', runtime: 'na', latest_status: 'success' },
      { name: 'pipeline4', type: 'image', repo: 'na', branch: 'na', runtime: 'na', latest_status: 'success' },
      { name: 'pipeline5', type: 'image', repo: 'na', branch: 'na', runtime: 'na', latest_status: 'success' },
    ];

    this.pipelineDataSource.data = pipelines;
  }

  edit(row: Pipeline): void {
    const data: any = {
      pipeline: row,
      action: 'edit'
    }
    this.result.next(data);
  }

  uploadImage(row: Pipeline): void {
    const data: any = {
      pipeline: row,
      action: 'upload_image'
    }
    this.result.next(data);
  }

  deploy(row: Pipeline): void {
    const data: any = {
      pipeline: row,
      action: 'deploy'
    }
    this.result.next(data);
  }

  delete(row: Pipeline): void {
    const data: any = {
      pipeline: row,
      action: 'delete'
    }
    this.result.next(data);
  }

}
