import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { ProjectsService } from 'src/app/restapi/user-swagger/services';
import { Member } from 'src/app/restapi/user-swagger/models';
import { ProjectService } from 'src/app/services/project.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators';

interface PendingMember {
  email: string;
  role: string;
}

@Component({
  selector: 'app-project-members-tab',
  templateUrl: './project-members-tab.component.html',
  styleUrls: ['./project-members-tab.component.scss']
})
export class ProjectMembersTabComponent implements OnInit {

  loginUserGroupName: string;
  roleList: Array<string> = [ProjectService.ADMIN_ROLE, ProjectService.DEV_ROLE, ProjectService.OPS_ROLE];
  expandedHeight: string = '48px';
  memberColumns: string[] = ['user_name', 'email', 'role', 'delete'];
  pendingMemberColumns: string[] = ['user_name', 'email', 'role', 'reinvite', 'delete'];
  adminMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  devMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  opsMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  pendingMemberDataSource: MatTableDataSource<PendingMember> = new MatTableDataSource<PendingMember>([]);

  constructor(
    private userService: UserService,
    private projectsService: ProjectsService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.projectService.bsProject.subscribe((res => {
      this.initGroupMembers();
    }));

    this.projectService.loginUserGroupName.subscribe((res: string) => {
      this.loginUserGroupName = res;
    });
  }

  initGroupMembers(): void {
    this.adminMemberDataSource.data = this.projectService.getGroupMembersByRole(ProjectService.ADMIN_ROLE);
    this.devMemberDataSource.data = this.projectService.getGroupMembersByRole(ProjectService.DEV_ROLE);
    this.opsMemberDataSource.data = this.projectService.getGroupMembersByRole(ProjectService.OPS_ROLE);
    this.pendingMemberDataSource.data = this.convertPendingMemberDataSource();
  }

  isOwner(userId: string): boolean {
    return (this.projectService.project.owner == userId) ? true : false;
  }

  convertPendingMemberDataSource(): Array<PendingMember> {
    let pendingMember: Array<PendingMember> = [];

    Object.assign([], this.projectService.getGroupPendingMembers()).forEach(m => {
      pendingMember.push({ email: m.email, role: '' });
    });

    return pendingMember;
  }

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
  }

  // 맴버의 그룹정보 변경
  updateRole(element: Member, role: string): void {
    if (this.loginUserGroupName != ProjectService.ADMIN_ROLE) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Update member roles',
          message: 'Admin permissions required.'
        }
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Update member roles',
        description: 'Are you sure you want to update?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectsService.projectsProjectIdGroupsGroupIdMembersPatch({
          projectId: this.projectService.project.id,
          groupId: this.projectService.project.groups.find(g => g.name == role).id,
          memberId: element.user_id
        }).subscribe(() => {
          this.projectService.projectsProjectIdGet();
        });
      }
    });
  }

  // 특정 그룹으로 멤버 초대
  reInvite(element: PendingMember): void {
    console.log(element)
    if (this.loginUserGroupName != ProjectService.ADMIN_ROLE) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Invite member to Gantry',
          message: 'Admin permissions required.'
        }
      });
      return;
    }

    if (element.role == "") {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Invite member to Gantry',
          message: 'Group is required.'
        }
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Invite member to Gantry',
        description: 'Do you want to send invitation?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        const groupId: string = this.projectService.project.groups.find(g => g.name == element.role).id;

        this.projectsService.projectsProjectIdGroupsGroupIdInvitationPut({
          projectId: this.projectService.project.id,
          groupId: groupId,
          email: element.email
        }).subscribe(() => {
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Invites sent',
              message: `You've invited members to Gantry`
            }
          });
        },
          (err) => { console.error(err); }
        );
      }
    });
  }

  // 프로젝트에서 멤버 삭제
  deleteMember(element: Member): void {
    if (this.loginUserGroupName != ProjectService.ADMIN_ROLE) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Delete member',
          message: 'Admin permissions required.'
        }
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete member',
        description: 'Are you sure you want to delete?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectsService.projectsProjectIdMembersMemberIdDelete({
          projectId: this.projectService.project.id,
          memberId: element.user_id
        }).subscribe(() => {
          this.projectService.projectsProjectIdGet();
        });
      }
    });
  }

  // Pending 멤버 삭제
  deletePendingMember(element: Member): void {
    if (this.loginUserGroupName != ProjectService.ADMIN_ROLE) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Delete pending member',
          message: 'Admin permissions required.'
        }
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete member',
        description: 'Are you sure you want to delete?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {

        // this.projectsService.projectsProjectIdMembersMemberIdDelete({
        //   projectId: this.projectService.project.id,
        //   memberId: member.user_id
        // }).subscribe(() => {
        //   this.projectService.projectsProjectIdGet();
        // });

      }
    });
  }

}
