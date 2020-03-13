import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  projects: Array<any>;
  currentViewName: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.projects = ["PROJECT 1", "PROJECT 2", "PROJECT 3", "PROJECT 4", "PROJECT 5", "PROJECT 6"];
    this.currentViewName = "image"
  }

  navigate(project: string) {
    this.router.navigate([`project/${project}`]);
  }

}
