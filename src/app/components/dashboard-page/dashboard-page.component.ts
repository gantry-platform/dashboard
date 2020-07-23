import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectPopupComponent } from '../create-project-popup/create-project-popup.component';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  currentView: string;

  constructor(
    private router: Router,
    public projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.currentView = 'image';
    this.projectService.projectsGet();
  }

  createProject() {
    this.dialog.open(CreateProjectPopupComponent);
  }

  navigate(projectId: string): void {
    this.router.navigate([`project/${projectId}`]);
  }

}
