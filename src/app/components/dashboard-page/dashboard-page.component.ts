import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Project } from 'src/app/restapi/user-swagger/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  currentView: string;
  projects: Array<Project>;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentView = 'image';
    this.projects = this.userService.user.projects;
  }

  createProject() {

  }

  navigate(projectId: string): void {
    this.router.navigate([`project/${projectId}`]);
  }

}
