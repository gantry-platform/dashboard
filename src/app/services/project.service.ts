import { Injectable } from '@angular/core';
import { ProjectsService } from '../restapi/user-swagger/services';
import { UserService } from './user.service';
import { Project, Group, PendingUser, Member } from '../restapi/user-swagger/models';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  static readonly ADMIN_ROLE = 'admin';
  static readonly DEV_ROLE = 'dev';
  static readonly OPS_ROLE = 'ops';

  project: Project = null;
  bsProject: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  loginUserGroupName = new BehaviorSubject<string>(null);

  constructor(
    private userService: UserService,
    private projectsService: ProjectsService
  ) {
  }

  clean(): void {
    this.project = null;
  }

  // 프로젝트 정보 조회
  projectsProjectIdGet(projectId: string = this.project.id): void {
    // this.project = null;

    const params: any = {
      projectId: projectId
    }

    this.projectsService.projectsProjectIdGet(params).pipe(
      take(1)
    ).subscribe((res: Project) => {
      console.log("프로젝트 정보 조회");
      console.log(res);
      this.project = res;
      this.bsProject.next(res);

      // 로그인 사용자 그룹
      const loginUserGroup: Group = this.getLoginUserGroup();
      if (loginUserGroup) {
        this.loginUserGroupName.next(loginUserGroup.name);
      }
    },
      (err) => {
        console.error(err);
      }
    );
  };

  getLoginUserGroup(): Group {
    return this.project.groups.find((g: Group) => {
      if (g.members) {
        return g.members.find((m: Member) => m.user_id == this.userService.userInfo.sub);
      }
    });
  }

  getGroupMembersByRole(role: string): Array<Member> {
    let group: Group = Object.assign({}, this.project.groups.find(g => g.name === role));

    if (group.members) {
      group.members = group.members.filter(m => m.email_verified);
    } else {
      group.members = [];
    }

    return group.members;
  }

  getGroupPendingMembers(): Array<PendingUser> {
    return this.project.pending_users;
  }

  checkExistEmail(email: string): boolean {
    const idx: number = this.project.groups.findIndex((g: Group) => {
      if (g.members) {
        return g.members.findIndex(m => m.email == email) != -1;
      }
    });

    return (idx > -1) ? false : true;
  }

}
