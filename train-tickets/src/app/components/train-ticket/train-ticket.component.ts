import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-train-ticket',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './train-ticket.component.html',
  styleUrls: ['./train-ticket.component.scss']
})
export class TrainTicketComponent {
  @Input() ticket!: Ticket;
  
  constructor(public dialog: MatDialog) {}
  
  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        console.log('Ticket purchased:', this.ticket);
      }
    });
  }
}
