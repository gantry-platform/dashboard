import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { Member } from 'src/app/restapi/user-swagger/models';
import { ProjectsService } from 'src/app/restapi/user-swagger/services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-project-members-tab',
  templateUrl: './project-members-tab.component.html',
  styleUrls: ['./project-members-tab.component.scss']
})
export class ProjectMembersTabComponent implements OnInit {

  roleList: Array<string> = [ProjectService.ADMIN_ROLE, ProjectService.DEV_ROLE, ProjectService.OPS_ROLE];
  expandedHeight: string = '48px';
  memberColumns: string[] = ['user_name', 'email', 'role', 'delete'];
  pendingMemberColumns: string[] = ['user_name', 'email', 'reinvite', 'delete'];
  adminMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  devMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  opsMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);
  pendingMemberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>([]);

  constructor(
    private userService: UserService,
    private projectsService: ProjectsService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initGroupMembers();
  }

  initGroupMembers(): void {
    this.adminMemberDataSource = new MatTableDataSource<Member>(this.projectService.getGroupMembersByRole(ProjectService.ADMIN_ROLE));
    this.devMemberDataSource = new MatTableDataSource<Member>(this.projectService.getGroupMembersByRole(ProjectService.DEV_ROLE));
    this.opsMemberDataSource = new MatTableDataSource<Member>(this.projectService.getGroupMembersByRole(ProjectService.OPS_ROLE));
    this.pendingMemberDataSource = new MatTableDataSource<Member>(this.projectService.getGroupPendingMembers());
  }

  checkProjectOwner(id: string): boolean {
    return this.projectService.checkProjectOwner(id);
  }

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
  }

  // 맴버의 그룹정보 변경
  updateRole(member: Member, role: string): void {
    this.projectsService.userIdProjectsProjectIdGroupsGroupIdMembersPatch({
      userId: this.userService.user.user_id,
      projectId: this.projectService.project.id,
      groupId: this.projectService.project.groups.find(g => g.name == role).id,
      memberId: member.user_id
    }).subscribe((res) => {
      console.log(res);
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Update group',
          message: 'Request was processed normally.'
        }
      });

      this.projectService.userIdProjectsProjectIdGet();
    },
      (err) => { console.error(err); }
    );

  }

  reInvite(element: Member): void {
    console.log(element);
  }

  deleteMember(element: Member): void {
    console.log(element);
    // this.projectService.test().subscribe(res=> {
    //   this.projectService.project = res;
    //   this.projectService.project.groups.find(g=> g.name == 'admin').members = [];
    //   console.log(this.projectService.project);
    //   this.initGroupMembersData();
    // });


  }

}
