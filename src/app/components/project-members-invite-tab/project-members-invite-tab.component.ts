import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Member } from 'src/app/restapi/project-swagger/models';
import { ProjectService } from 'src/app/services/project.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

interface InviteMember {
  email: string;
  role: string;
}

interface PendingMember {
  email: string;
  role: string;
}

@Component({
  selector: 'app-project-members-invite-tab',
  templateUrl: './project-members-invite-tab.component.html',
  styleUrls: ['./project-members-invite-tab.component.scss']
})
export class ProjectMembersInviteTabComponent implements OnInit {

  roleList: Array<string> = [ProjectService.ADMIN_GROUP, ProjectService.DEV_GROUP, ProjectService.OPS_GROUP];
  expandedHeight: string = '48px';
  inviteMemberColumns: string[] = ['invite_user_name', 'invite_email', 'invite_role', 'invite_delete'];
  pendingMemberColumns: string[] = ['user_name', 'email', 'role', 'reinvite', 'delete'];
  inviteMemberDataSource: MatTableDataSource<InviteMember> = new MatTableDataSource<InviteMember>([]);
  pendingMemberDataSource: MatTableDataSource<PendingMember> = new MatTableDataSource<PendingMember>([]);
  form: FormGroup;
  emailList: Array<InviteMember> = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initPendingMembers();
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  initPendingMembers(): void {
    this.pendingMemberDataSource.data = [];

    let pendingMember: Array<PendingMember> = [];
    Object.assign([], this.projectService.project.pending_users).forEach(m => {
      pendingMember.push({ email: m.email, role: '' });
    });
    this.pendingMemberDataSource.data = pendingMember;
  }

  resetForm(): void {
    this.form.patchValue({ email: '', role: '' });
    this.form.markAsUntouched();
    this.emailList = [];
    this.inviteMemberDataSource.data = [];
  }

  get fc_email() { return this.form.get('email'); }
  get fc_role() { return this.form.get('role'); }

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
  }

  add(): void {
    if (!this.validateForm()) return;

    const inviteMember: InviteMember = {
      email: this.fc_email.value,
      role: this.fc_role.value
    }
    this.emailList.push(inviteMember);
    this.inviteMemberDataSource.data = this.emailList;

    this.form.patchValue({ email: '', role: '' });
    this.form.markAsUntouched();
  }

  convertInviteUserName(email: string): string {
    return email.split("@")[0];
  }

  deleteInviteMember(element: InviteMember): void {
    const idx: number = this.emailList.findIndex(x => x.email == element.email);
    if (idx > -1) {
      this.emailList.splice(idx, 1);
      this.inviteMemberDataSource.data = this.emailList;
    }
  }

  cancel(): void {
    this.resetForm();
    this.emailList = [];
    this.inviteMemberDataSource.data = [];
  }

  // 사용자 초대
  invite(): void {
    if (this.emailList.length == 0) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Invite member to Gantry',
          message: 'Add at least one email address before sending invitations.'
        }
      });
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Invite member to Gantry',
        message: 'Do you want to send invitation?',
        okText: 'OK',
        cancelText: 'CANCEL'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.forkInvitationPut();
      }
    });
  }

  // 사용자 초대
  forkInvitationPut(): void {
    let inviteList: any = [];

    this.emailList.forEach((data: InviteMember) => {
      const groupId: string = this.projectService.project.groups.find(g => g.name == data.role).id;
      inviteList.push(this.projectService.projectsProjectIdGroupsGroupIdInvitationPut(groupId, data.email));
    });

    forkJoin(inviteList).subscribe((res) => {
      console.log(res);
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Invites sent',
          message: `You've invited members to Gantry`
        }
      });

      this.projectService.projectsProjectIdGet(this.projectService.project.id);
      this.resetForm();
    },
      (err) => { console.error(err); }
    );
  }

  // 사용자 재 초대
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

  validateForm(): boolean {
    const invalid: any = Object.keys(this.form.controls).map(name => this.form.controls[name]).filter(control => control.invalid);

    if (invalid.length > 0) {
      invalid.forEach((control: FormControl) => control.markAsTouched({ onlySelf: true }));
      return false;
    }

    // 화면에 이미 추가되었는지 확인
    const idx: number = this.emailList.findIndex(x => x.email == this.fc_email.value);
    if (idx > -1) {
      return false;
    }

    // 그룹에 이미 추가되었는지 확인
    // 그룹은 상관없음.
    if (!this.projectService.checkExistEmail(this.fc_email.value)) {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Invite member to Gantry',
          message: 'This member is already in group'
        }
      });
      return false;
    }

    return true;
  }

  isFieldValid(name: string): boolean {
    return !this.form.get(name).valid && this.form.get(name).touched;
  }

  displayFieldCss(field: string): any {
    return { 'has-error': this.isFieldValid(field) };
  }

}
