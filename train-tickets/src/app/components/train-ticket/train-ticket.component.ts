import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Ticket } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

@Component({
  selector: 'app-train-ticket',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './train-ticket.component.html',
  styleUrls: ['./train-ticket.component.scss']
})
export class TrainTicketComponent implements OnInit {
  @Input() ticket!: Ticket;
  @Output() ticketUpdated = new EventEmitter<void>();
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isAdmin = user?.email === 'admin@admin.com';
    });
  }

  editTicket() {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      data: this.ticket
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ticketService.updateTicket(this.ticket.id.toString(), result).subscribe({
          next: () => {
            this.ticketUpdated.emit();
          },
          error: (error) => {
            console.error('Error updating ticket:', error);
          }
        });
      }
    });
  }

  deleteTicket() {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(this.ticket.id.toString()).subscribe({
        next: () => {
          this.ticketUpdated.emit();
        },
        error: (error) => {
          console.error('Error deleting ticket:', error);
        }
      });
    }
  }
}
