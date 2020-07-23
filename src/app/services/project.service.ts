import { Injectable } from '@angular/core';
import { ProjectsService } from '../restapi/project-swagger/services';
import { Project, Group, PendingUser, Member } from '../restapi/project-swagger/models';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  static readonly ADMIN_GROUP = 'admin';
  static readonly DEV_GROUP = 'dev';
  static readonly OPS_GROUP = 'ops';

  projects: Array<Project> = [];
  project: Project;

  constructor(
    private userService: UserService,
    private projectRestApiService: ProjectsService
  ) {

  }

  clean(): void {
    this.projects = [];
    this.project = null;
  }

  // 전체 프로젝트 조회
  projectsGet(): void {
    this.projectRestApiService.projectsGet().pipe(
      take(1)
    ).subscribe((res: Array<Project>) => {
      // console.log("프로젝트 조회");
      // console.log(res);
      // this.projects = res;
      console.log("프로젝트 조회");
      console.log(res);
      this.projects = res.filter(x => x != null);
      console.log(this.projects);
    });
  }

  // 프로젝트 상세 조회
  projectsProjectIdGet(projectId: string): void {
    this.project = null;

    const params: any = {
      projectId: projectId
    }

    this.projectRestApiService.projectsProjectIdGet(params).pipe(
      take(1)
    ).subscribe((res: Project) => {
      console.log("프로젝트 정보 조회");
      console.log(res);
      this.project = res;
    });
  };

  // 프로젝트 그룹 정보 조회
  // projectsProjectIdGroupsGet(): Observable<Array<Group>> {
  //   const params: any = {
  //     projectId: this.project.id
  //   }

  //   return this.projectRestApiService.projectsProjectIdGroupsGet(params);
  // };

  // 신규 프로젝트 생성
  projectsPost(name: string, description: string): Observable<Project> {
    const params: any = {
      body: {
        name: name,
        description: description
      }
    }

    return this.projectRestApiService.projectsPost(params);
  };

  // 그룹 정보 변경
  projectsProjectIdGroupsGroupIdMembersPatch(memberId: string, groupName: string): Observable<void> {
    const groupId: string = this.project.groups.find(x => x.name == groupName).id;
    const params: any = {
      projectId: this.project.id,
      groupId: groupId,
      memberId: memberId
    }

    return this.projectRestApiService.projectsProjectIdGroupsGroupIdMembersPatch(params);
  }

  // 사용자 삭제
  projectsProjectIdMembersMemberIdDelete(memberId: string): Observable<void> {
    const params: any = {
      projectId: this.project.id,
      memberId: memberId
    }

    return this.projectRestApiService.projectsProjectIdMembersMemberIdDelete(params);
  }

  // 사용자 초대
  projectsProjectIdGroupsGroupIdInvitationPut(groupId: string, email: string): Observable<void> {
    return this.projectRestApiService.projectsProjectIdGroupsGroupIdInvitationPut({
      projectId: this.project.id,
      groupId: groupId,
      email: email
    });
  }

  // invitation 리스트에서 삭제한다.
  projectsProjectIdGroupsInvitationDelete(email: string): Observable<void> {
    const params: any = {
      projectId: this.project.id,
      email: email
    }

    return this.projectRestApiService.projectsProjectIdGroupsInvitationDelete(params);
  }

  // 권한에 따른 사용자 분류
  getGroupMembersByRole(role: string): Array<Member> {
    let group: Group = Object.assign({}, this.project.groups.find(g => g.name === role));

    if (group.members) {
      group.members = group.members.filter(m => m.email_verified);
    } else {
      group.members = [];
    }

    return group.members;
  }

  // 로그인한 사용자의 프로젝트 권한이 관리자인지 확인
  checkLoginUserAdminRole(): boolean {
    if (this.project.owner == this.userService.userInfo.sub) {
      return true;
    }
    return false;
  }

  // 로그인한 사용자의 그룹
  getLoginUserGroupName(): string {
    return this.project.groups.find((g: Group) => {
      if (g.members) {
        return g.members.find((m: Member) => m.user_id == this.userService.userInfo.sub);
      }
    }).name;
  }

  // 프로젝트에 이메일 존재 유무 확인
  checkExistEmail(email: string): boolean {
    const idx: number = this.project.groups.findIndex((g: Group) => {
      if (g.members) {
        return g.members.findIndex(m => m.email == email) != -1;
      }
    });

    return (idx > -1) ? false : true;
  }

}
