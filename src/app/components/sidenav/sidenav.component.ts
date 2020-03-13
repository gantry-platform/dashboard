import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  projectName: string;
  appitems = [
    { label: 'Pods', onSelected: () => { this.navigate('pods') } },
    { label: 'Services', onSelected: () => { this.navigate('services') } },
    { label: 'Container Images' },
    {
      label: 'Deployments',
      items: [
        {
          label: 'Catalog'
        },
        {
          label: 'Pipeline',
        }
      ]
    },
    { label: 'Logs' },
    { label: 'Events' },
    {
      label: 'Settings',
      items: [
        { label: 'General' },
        { label: 'Members' },
        { label: 'Backup' }
      ]
    }
  ];

  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,
    classname: 'sidenav-menu',
    listBackgroundColor: "#002141",
    fontColor: "#ffffff",
    backgroundColor: "#002141",
    selectedListFontColor: "red",
    highlightOnSelect: true,
    collapseOnSelect: true,
    rtlLayout: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(map(p => p.id)).subscribe(res => this.projectName = res);
  }

  navigate(menu: string): void {
    this.router.navigate([`project/${this.projectName}/${menu}`]);
  }

}