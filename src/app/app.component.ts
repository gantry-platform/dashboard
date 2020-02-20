import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Gantry Dashboard';
  userProfile: KeycloakProfile;

  constructor(
    private keycloakService: KeycloakService
  ) {
    
    this.keycloakService.loadUserProfile(false).then((res) => {
      this.userProfile = res;
    }).catch((err) => console.log(err));

  }

  get userName() {
    return this.keycloakService.getUsername();
  }

  logout() {
    this.keycloakService.logout();
  }
}
