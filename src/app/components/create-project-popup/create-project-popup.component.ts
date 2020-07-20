import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'src/app/restapi/user-swagger/services';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-project-popup',
  templateUrl: './create-project-popup.component.html',
  styleUrls: ['./create-project-popup.component.scss']
})
export class CreateProjectPopupComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateProjectPopupComponent>,
    private fb: FormBuilder,
    private usersService: UsersService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('450px');
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      display_name: ['', Validators.required],
      description: ''
    });
  }

  get fc_displayName() { return this.form.get('display_name'); }
  get fc_description() { return this.form.get('description'); }

  cancel(): void {
    this.dialogRef.close();
  }

  create(): void {

    // if (!this.validateForm()) return;

    // const param = {
    //   body: {
    //     display_name: this.fc_displayName.value,
    //     description: this.fc_description.value
    //   }
    // }

    // this.usersService.usersProjectsPost(param).subscribe(() => {
    //   this.userService.usersGet(false);
    //   this.dialogRef.close();
    // });
  }

  validateForm() {
    let invalid: any = Object.keys(this.form.controls).map(name => this.form.controls[name]).filter(control => control.invalid);

    if (invalid.length > 0) {
      invalid.forEach(control => control.markAsTouched({ onlySelf: true }));
      return false;
    }

    return true;
  }

  isFieldValid(name: string) {
    return this.form.get(name).invalid && this.form.get(name).touched;
  }

  displayFieldCss(field: string) {
    return { 'has-error': this.isFieldValid(field) };
  }

}
