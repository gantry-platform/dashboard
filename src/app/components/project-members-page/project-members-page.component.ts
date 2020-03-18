import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/restapi/user-swagger/services';
import { User } from 'src/app/restapi/user-swagger/models';
import { take } from 'rxjs/operators';

export interface UserElement {
  name: string;
  email: string;
  role: string;
}

const ELEMENT_DATA: UserElement[] = [
  { name: 'minchulahn', email: "minchulahn@inslab.co.kr", role: 'Admin' },
  { name: 'minchulahn', email: "minchulahn@inslab.co.kr", role: 'Admin' },
  { name: 'minchulahn', email: "minchulahn@inslab.co.kr", role: 'Admin' },
  { name: 'minchulahn', email: "minchulahn@inslab.co.kr", role: 'Admin' },
  { name: 'minchulahn', email: "minchulahn@inslab.co.kr", role: 'Admin' },
];

@Component({
  selector: 'app-project-members-page',
  templateUrl: './project-members-page.component.html',
  styleUrls: ['./project-members-page.component.scss']
})
export class ProjectMembersPageComponent implements OnInit {

  userId: string = "810ebe23-9871-40eb-8a10-e561cae613f5";
  displayedColumns: string[] = ['name', 'email', 'role', 'delete'];
  dataSource = ELEMENT_DATA;
  expandedHeight: string = "48px";

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
  }

  usersUserIdGet(): void {
    const params: any = {
      userId: this.userId
    }

    this.usersService.usersUserIdGet(params).pipe(
      take(1)
    ).subscribe((res: User) => {
      console.log(res);
    },
      (err) => { console.error(err); }
    );
  }

}
