import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {

  existProject: boolean = false;
  projectName: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    public projectService: ProjectService
  ) { }

  ngOnInit(): void {
    // this.activatedRoute.params.pipe(map(p => p.id)).subscribe(projectId => {
      
    //   if(!this.userService.user.projects) {
    //     this.router.navigate(['/']);
    //     return;
    //   }

    //   const idx: number = this.userService.user.projects.findIndex(p => p.id == projectId);

    //   if (idx === -1) {
    //     this.router.navigate(['/404']);
    //     return;
    //   }
      
    //   this.projectService.projectsProjectIdGet(projectId);
    // });
  }

  ngOnDestroy(): void {
    console.log("Destroy Project Page");
    this.projectService.clean();
  }

}
