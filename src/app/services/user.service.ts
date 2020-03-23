import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UsersService } from '../restapi/user-swagger/services';
import { User } from '../restapi/user-swagger/models';
import { UserInfo } from './auth.service'
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: UserInfo;
  user: User;

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.authService.userInfo.subscribe((res: UserInfo) => {
      this.userInfo = res;
      console.log(this.userInfo);
    });
  }

  usersUserIdGet(projectInfo: boolean): void {
    this.user = null;

    const params: any = {
      userId: this.userInfo.sub,
      projectInfo: projectInfo
    }

    this.usersService.usersUserIdGet(params).pipe(
      take(1)
    ).subscribe((res: User) => {
      console.log("유저 정보 조회");
      console.log(res);
      this.user = res;
    },
      (err) => { console.error(err); }
    );
  }
}
