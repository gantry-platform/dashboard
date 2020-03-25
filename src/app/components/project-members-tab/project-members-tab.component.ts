import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectService } from 'src/app/services/project.service';
import { Member } from 'src/app/restapi/user-swagger/models';

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
    private projectService: ProjectService
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

  convertPendingUserName(value: string): string {
    return value.split('@')[0];
  }

  pendingMembersFilter(filterValue: string): void {
    this.pendingMemberDataSource.filter = filterValue.trim().toLowerCase();
  }

  updateRole(element: Member, role: string): void {
    console.log(element);
    console.log(role);
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
