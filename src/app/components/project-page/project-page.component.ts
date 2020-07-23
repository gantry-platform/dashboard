import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {

  projectFlg: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(map(p => p.id)).subscribe(projectId => {
      this.projectService.projectsProjectIdGet(projectId);
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy Project Page");
    this.projectService.clean();
  }

}
