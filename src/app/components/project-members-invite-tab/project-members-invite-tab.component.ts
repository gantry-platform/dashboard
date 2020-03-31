import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectsService } from 'src/app/restapi/user-swagger/services';
import { Member } from 'src/app/restapi/user-swagger/models';
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

  loginUserGroupName: string;
  roleList: Array<string> = [ProjectService.ADMIN_ROLE, ProjectService.DEV_ROLE, ProjectService.OPS_ROLE];
  expandedHeight: string = '48px';
  inviteMemberColumns: string[] = ['invite_user_name', 'invite_email', 'invite_role', 'invite_delete'];
  pendingMemberColumns: string[] = ['user_name', 'email', 'role', 'reinvite', 'delete'];
  inviteMemberDataSource: MatTableDataSource<InviteMember> = new MatTableDataSource<InviteMember>([]);
  pendingMemberDataSource: MatTableDataSource<PendingMember> = new MatTableDataSource<PendingMember>([]);
  form: FormGroup;
  emailList: Array<InviteMember> = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private projectsService: ProjectsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.projectService.bsProject.subscribe((res => {
      this.initGroupPendingMembers();
    }));

    this.projectService.loginUserGroupName.subscribe((res: string) => {
      this.loginUserGroupName = res;
    });

    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  resetForm(): void {
    this.form.patchValue({ email: '', role: '' });
    this.form.markAsUntouched();
    this.emailList = [];
    this.inviteMemberDataSource.data = [];
  }

  get fc_email() { return this.form.get('email'); }
  get fc_role() { return this.form.get('role'); }

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
        description: 'Do you want to send invitation?',
        okText: 'OK',
        cancelText: 'CANCEL'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.forkInvitationPut();
      }
    });
  }

  initGroupPendingMembers(): void {
    this.pendingMemberDataSource.data = this.convertPendingMemberDataSource();
  }

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  convertPendingMemberDataSource(): Array<PendingMember> {
    let pendingMember: Array<PendingMember> = [];

    Object.assign([], this.projectService.getGroupPendingMembers()).forEach(m => {
      pendingMember.push({ email: m.email, role: '' });
    });

    return pendingMember;
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
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
        title: 'Delete pending member',
        description: 'Are you sure you want to delete?',
        okText: 'OK',
        cancelText: 'Cancel'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectsService.projectsProjectIdGroupsInvitationDelete({
          projectId: this.projectService.project.id,
          email: element.email
        }).subscribe(() => {
          this.projectService.projectsProjectIdGet();
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

    // 이메일 유효성 확인
    if (!this.validateEmail(this.fc_email.value)) {
      return false;
    }

    // 화면에 이미 추가되었는지 확인
    // 그룹은 상관없음.
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

  validateEmail(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }

    return false;
  }

  isFieldValid(name: string): boolean {
    return !this.form.get(name).valid && this.form.get(name).touched;
  }

  displayFieldCss(field: string): any {
    return { 'has-error': this.isFieldValid(field) };
  }

  // 특정 그룹으로 맴버초대
  forkInvitationPut() {
    let inviteList: any = [];

    this.emailList.forEach((data: InviteMember) => {
      const groupId: string = this.projectService.project.groups.find(g => g.name == data.role).id;

      inviteList.push(
        this.projectsService.projectsProjectIdGroupsGroupIdInvitationPut({
          projectId: this.projectService.project.id,
          groupId: groupId,
          email: data.email
        })
      );
    });

    forkJoin(inviteList).subscribe((res) => {
      console.log(res);
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Invites sent',
          message: `You've invited members to Gantry`
        }
      });

      this.resetForm();
    },
      (err) => { console.error(err); }
    );
  }

}
