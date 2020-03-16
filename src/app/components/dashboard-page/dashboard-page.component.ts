import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  projects: Array<any>;
  currentView: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.projects = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5", "Project 6"];
    this.currentView = 'image';
  }

  navigate(project: string) {
    this.router.navigate([`project/${project}`]);
  }

}
