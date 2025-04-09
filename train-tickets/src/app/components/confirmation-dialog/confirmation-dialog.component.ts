import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h1 mat-dialog-title>Confirm Purchase</h1>
<div mat-dialog-content>
  <p>Are you sure you want to buy this ticket?</p>
</div>
<div mat-dialog-actions>
  <button mat-raised-button color="warn" (click)="onNoClick()">No</button>
  <button mat-raised-button color="primary" (click)="onYesClick()">Yes</button>
</div>

  `,
  styles: [
    'h1 { font-size: 1.5rem; }',
    'p { margin: 0; }'
  ]
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
