import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface AlertDialogData {
  title: string;
  message: string;
  width?: string;
}

@Component({
  selector: 'fc-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData,
    private dialogRef: MatDialogRef<AlertDialogComponent>
  ) { }

  ngOnInit() {
    if (this.data.width) {
      this.dialogRef.updateSize(this.data.width);
    } else {
      this.dialogRef.updateSize('412px');
    }
  }

}
