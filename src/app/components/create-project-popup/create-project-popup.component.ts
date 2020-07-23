import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/restapi/project-swagger/models';
import { take } from 'rxjs/operators';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

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
    private projectService: ProjectService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('450px');
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ''
    });
  }

  get fc_name() { return this.form.get('name'); }
  get fc_description() { return this.form.get('description'); }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.valid) {
      this.projectService.projectsPost(this.fc_name.value, this.fc_description.value).pipe(
        take(1)
      ).subscribe((res: Project) => {
        console.log("신규 프로젝트 생성");
        console.log(res);

        this.projectService.projectsGet();
        this.dialogRef.close();
      },
        (err) => {
          this.dialogRef.close();
        }
      );
    }
  }

  isFieldValid(name: string): boolean {
    return this.form.get(name).invalid && this.form.get(name).touched;
  }

  displayFieldCss(field: string): any {
    return { 'has-error': this.isFieldValid(field) };
  }

}