import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Configuration, MultilevelNodes } from 'ng-material-multilevel-menu';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  opened: boolean = true;
  config: Configuration;
  appitems: Array<MultilevelNodes> = [];

  constructor(
    private router: Router,
    public projectService: ProjectService
  ) {
  }

  ngOnInit(): void {
    this.setConfiguration();
    this.setMultilevelNodes();
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
      { label: 'Pipeline', link: this.itemLink('pipeline') },
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
    return `/project/${this.projectService.project.id}/${menu}`;
  }

  navigate(event: any): void {
    this.router.navigate([event.link]);
  }

}