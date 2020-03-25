import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { Member } from 'src/app/restapi/user-swagger/models';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

interface InviteMember {
  email: string;
  role: string;
}

@Component({
  selector: 'app-project-members-invite-tab',
  templateUrl: './project-members-invite-tab.component.html',
  styleUrls: ['./project-members-invite-tab.component.scss']
})
export class ProjectMembersInviteTabComponent implements OnInit {

  roleList: Array<string> = [ProjectService.ADMIN_ROLE, ProjectService.DEV_ROLE, ProjectService.OPS_ROLE];
  expandedHeight: string = '48px';
  inviteMemberColumns: string[] = ['invite_user_name', 'invite_email', 'invite_role', 'invite_delete'];
  pendingMemberColumns: string[] = ['user_name', 'email', 'reinvite', 'delete'];
  inviteMemberDataSource: MatTableDataSource<InviteMember> = new MatTableDataSource<InviteMember>([]);
  pendingMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  form: FormGroup;
  emailList: Array<InviteMember> = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initGroupPendingMembers();
  }

  initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  resetForm(): void {
    this.form.patchValue({ email: '', role: '' });
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

    this.resetForm();
  }

  convertInviteUserName(): string {
    return this.fc_email.value.split("@")[0];
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
        description: '',
        okText: 'OK',
        cancelText: 'CANCEL'
      }
    }).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      console.log(confirmed);
      if (confirmed) {
        this.forkInvitationPut();
      }
    });
  }

  initGroupPendingMembers(): void {
    this.pendingMemberDataSource.data = this.projectService.getGroupPendingMembers();
  }

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
  }

  reInvite(element: Member): void {
    console.log(element);
  }

  deleteMember(element: Member): void {
    console.log(element);
  }

  validateForm(): boolean {
    const invalid: any = Object.keys(this.form.controls).map(name => this.form.controls[name]).filter(control => control.invalid);

    if (invalid.length > 0) {
      invalid.forEach(control => control.markAsTouched({ onlySelf: true }));
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
    let params: any = [];

    this.emailList.forEach(data => {
      const groupId: string = this.projectService.project.groups.find(g => g.name == data.role).id;

      // params.push(
      //   this.projectService.userIdProjectsProjectIdGroupsGroupIdInvitationPut(
      //     {
      //       email: data.email,
      //       group_id: groupId,
      //       project_id: this.projectService.project.id,
      //       user_id: this.userService.user.user_id
      //     }
      //   )
      // );
    });

    forkJoin(params).subscribe((res) => {
      console.log(res);
    },
      (err) => { console.error(err); }
    );
  }

}
