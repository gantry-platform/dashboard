import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Member } from 'src/app/restapi/project-swagger/models';
import { UserService } from 'src/app/services/user.service';
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

  roleList: Array<string> = [ProjectService.ADMIN_GROUP, ProjectService.DEV_GROUP, ProjectService.OPS_GROUP];
  expandedHeight: string = '48px';
  memberColumns: string[] = ['user_name', 'email', 'role', 'delete'];
  pendingMemberColumns: string[] = ['user_name', 'email', 'role', 'reinvite', 'delete'];
  adminMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  devMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  opsMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  pendingMemberDataSource: MatTableDataSource<PendingMember> = new MatTableDataSource<PendingMember>([]);

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initGroupMembers();
  }

  initGroupMembers(): void {
    this.adminMemberDataSource.data = [];
    this.devMemberDataSource.data = [];
    this.opsMemberDataSource.data = [];
    this.pendingMemberDataSource.data = [];

    this.adminMemberDataSource.data = this.projectService.getGroupMembersByRole(ProjectService.ADMIN_GROUP);
    this.devMemberDataSource.data = this.projectService.getGroupMembersByRole(ProjectService.DEV_GROUP);
    this.opsMemberDataSource.data = this.projectService.getGroupMembersByRole(ProjectService.OPS_GROUP);

    let pendingMember: Array<PendingMember> = [];
    Object.assign([], this.projectService.project.pending_users).forEach(m => {
      pendingMember.push({ email: m.email, role: '' });
    });
    this.pendingMemberDataSource.data = pendingMember;
  }

  isOwner(userId: string): boolean {
    return (this.projectService.project.owner == userId) ? true : false;
  }

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
  }

  // 그룹 변경
  updateRole(element: any, changeGroup: string): void {
    if (this.projectService.getLoginUserGroupName() != ProjectService.ADMIN_GROUP) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Update member roles',
          message: 'Admin permissions required.'
        }
      });
      this.initGroupMembers();
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Update member roles',
        message: 'Are you sure you want to update?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.projectsProjectIdGroupsGroupIdMembersPatch(element.user_id, changeGroup).subscribe(() => {
          this.projectService.projectsProjectIdGet(this.projectService.project.id);
        });
      } else {
        this.initGroupMembers();
      }
    });

  }

  // 특정 그룹으로 사용자 초대
  reInvite(element: PendingMember): void {
    if (this.projectService.getLoginUserGroupName() != ProjectService.ADMIN_GROUP) {
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
        message: 'Do you want to send invitation?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        const groupId: string = this.projectService.project.groups.find(g => g.name == element.role).id;

        this.projectService.projectsProjectIdGroupsGroupIdInvitationPut(groupId, element.email).subscribe(() => {
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

  // 프로젝트에서 사용자 삭제
  deleteMember(element: any): void {
    if (this.projectService.getLoginUserGroupName() != ProjectService.ADMIN_GROUP) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Delete member',
          message: 'Admin permissions required.'
        }
      });
      return;
    }

    if (this.userService.user.user_name == element.user_name) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Delete member',
          message: 'Do not delete me.'
        }
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete member',
        message: 'Are you sure you want to delete?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.projectsProjectIdMembersMemberIdDelete(element.user_id).subscribe(() => {
          this.projectService.projectsProjectIdGet(this.projectService.project.id);
        });
      }
    });

  }

  // Pending 사용자 삭제
  deletePendingMember(element: Member): void {
    if (this.projectService.getLoginUserGroupName() != ProjectService.ADMIN_GROUP) {
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
        title: 'Delete pending member',
        message: 'Are you sure you want to delete?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.projectsProjectIdGroupsInvitationDelete(element.email).subscribe(() => {
          this.projectService.projectsProjectIdGet(this.projectService.project.id);
        });
      }
    });
  }

}
