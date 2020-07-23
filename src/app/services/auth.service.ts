import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo = new BehaviorSubject<UserInfo>(null);

  constructor(
    private keycloakService: KeycloakService
  ) {
    this.keycloakService.getKeycloakInstance().loadUserInfo().success((res: UserInfo) => {
      this.userInfo.next(res);
    }).error((err) => {
      console.error(err);
      this.logout();
    });
  }

  logout(): void {
    this.keycloakService.logout(location.origin);
  }
}
