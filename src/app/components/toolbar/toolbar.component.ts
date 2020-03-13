import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  userName: string;

  constructor(
    private keycloakService: KeycloakService
  ) { }

  ngOnInit(): void {
    this.userName = this.keycloakService.getUsername();

  }

}
