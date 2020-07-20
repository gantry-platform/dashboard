import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// import { Project } from 'src/app/restapi/user-swagger/models';
import { take } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
// import { ProjectsService, UsersService } from 'src/app/restapi/user-swagger/services';
import { UsersService } from 'src/app/restapi/user-swagger/services';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectPopupComponent } from '../create-project-popup/create-project-popup.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  currentView: string;
  // projects: Array<Project>;
  projects: Array<any>;

  constructor(
    private router: Router,
    private userService: UserService,
    private usersService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.currentView = 'image';
    // this.projects = this.userService.user.projects;
  }

  createProject() {
    this.dialog.open(CreateProjectPopupComponent);
  }

  navigate(projectId: string): void {
    this.router.navigate([`project/${projectId}`]);
  }

}
