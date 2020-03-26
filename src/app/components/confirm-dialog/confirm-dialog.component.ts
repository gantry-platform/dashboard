import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  width?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  public okText = 'OK';
  public cancelText = 'CANCEL';

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) { }

  ngOnInit(): void {
    if (this.data.width) {
      this.dialogRef.updateSize(this.data.width);
    } else {
      this.dialogRef.updateSize('412px');
    }

    if (this.data.okText) {
      this.okText = this.data.okText;
    }
    if (this.data.cancelText) {
      this.cancelText = this.data.cancelText;
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  ok(): void {
    this.dialogRef.close(true);
  }

}
