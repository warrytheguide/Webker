import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { TrainTicketComponent } from '../train-ticket/train-ticket.component';
import { AuthService } from '../../services/auth.service';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule, 
    TrainTicketComponent, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isAdmin = false;
  
  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loadTickets();

    this.authService.user$.subscribe(user => {
      this.isAdmin = user?.email === 'admin@admin.com';
    });
  }
  
  loadTickets() {
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }

  addNewTicket() {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newId = this.tickets.length > 0 
          ? Math.max(...this.tickets.map(t => t.id)) + 1 
          : 1;
        
        const newTicket: Ticket = {
          ...result,
          id: newId
        };
        
        this.ticketService.addTicket(newTicket).subscribe({
          next: () => {
            this.loadTickets();
          },
          error: (error) => {
            console.error('Error adding ticket:', error);
          }
        });
      }
    });
  }
}
