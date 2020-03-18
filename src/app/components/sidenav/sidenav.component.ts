import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Configuration, MultilevelNodes } from 'ng-material-multilevel-menu';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  opened: boolean = true;
  projectName: string;
  config: Configuration;
  appitems: Array<MultilevelNodes> = [];
  projects: Array<string> = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5", "Project 6"];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(map(p => p.id)).subscribe(res => {
      if (this.projects.findIndex(x => x === res) === -1) {
        this.router.navigate(['404']);
        return;
      }

      this.projectName = res;

      this.setConfiguration();
      this.setMultilevelNodes();
    });
  }

  setConfiguration(): void {
    this.config = {
      classname: 'sidenav-menu',
      paddingAtStart: true,
      interfaceWithRoute: true,
      // highlightOnSelect: true,
      // collapseOnSelect: true,
      // rtlLayout: false,
      listBackgroundColor: "#002141",
      fontColor: "#ffffff",
      backgroundColor: "#002141",
      selectedListFontColor: "red"
    };
  }

  setMultilevelNodes(): void {
    this.appitems = [
      { label: 'Pods', link: this.itemLink('pods') },
      { label: 'Services', link: this.itemLink('services') },
      // { label: 'Container Images', link: this.itemLink('members') },
      // {
      //   label: 'Deployments',
      //   items: [
      //     { label: 'Catalog', link: this.itemLink('members') },
      //     { label: 'Pipeline', link: this.itemLink('members') }
      //   ]
      // },
      // { label: 'Logs', link: this.itemLink('members') },
      // { label: 'Events', link: this.itemLink('members') },
      {
        label: 'Settings',
        items: [
          // { label: 'General', link: this.itemLink('members') },
          { label: 'Members', link: this.itemLink('members') },
          // { label: 'Backup', link: this.itemLink('members') }
        ]
      }
    ];
  }

  itemLink(menu: string): string {
    return `/project/${this.projectName}/${menu}`;
  }

  navigate(event: any): void {
    this.router.navigate([event.link]);
  }

}