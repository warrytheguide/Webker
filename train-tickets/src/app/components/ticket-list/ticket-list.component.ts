import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { TrainTicketComponent } from '../train-ticket/train-ticket.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, TrainTicketComponent],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  
  constructor(private ticketService: TicketService) {}
  
  ngOnInit(): void {
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
      }
    });
  }
}
