import { Injectable } from '@angular/core';
import { UsersService } from '../restapi/user-swagger/services';
import { User } from '../restapi/user-swagger/models';
import { AuthService, UserInfo } from './auth.service';
import { take } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: UserInfo;
  user: User;

  constructor(
    private authService: AuthService,
    private userRestApiService: UsersService
  ) {
    this.authService.userInfo.subscribe((res: UserInfo) => {
      if (!isNullOrUndefined(res)) {
        this.userInfo = res;
        console.log(this.userInfo);

        this.usersUserIdGet(this.userInfo.sub);
      }
    });
  }

  // 사용자 조회
  usersUserIdGet(userId: string) {
    this.user = null;

    const params: any = {
      userId: userId
    }

    this.userRestApiService.usersUserIdGet(params).pipe(
      take(1)
    ).subscribe((res: User) => {
      console.log("사용자 조회");
      console.log(res);
      this.user = res;
    },
      (err) => { console.error(err); }
    );

  }
}
