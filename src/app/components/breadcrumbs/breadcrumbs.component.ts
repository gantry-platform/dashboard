import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  menuItems: Array<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public projectService: ProjectService
  ) {
    this.menuItems = this.createBreadcrumbs(this.activatedRoute);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.menuItems = this.createBreadcrumbs(this.activatedRoute);
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const label = child.snapshot.data[BreadcrumbsComponent.ROUTE_DATA_BREADCRUMB];
      if (!isNullOrUndefined(label)) breadcrumbs.push(label);

      return this.createBreadcrumbs(child, breadcrumbs);
    }
  }

}
