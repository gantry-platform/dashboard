import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {
    this.authService.userInfo.subscribe(res => {
      if (!isNullOrUndefined(res)) {
        this.userService.usersUserIdGet(false);
      }
    });
  }
}
