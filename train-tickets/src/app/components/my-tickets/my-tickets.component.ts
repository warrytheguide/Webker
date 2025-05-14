import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="my-tickets-container">
      <h1>My Purchased Tickets</h1>
      
      <div *ngIf="loading" class="loading">
        Loading your tickets...
      </div>
      
      <div *ngIf="!loading && purchasedTickets.length === 0" class="no-tickets">
        <p>You haven't purchased any tickets yet.</p>
        <button mat-raised-button color="primary" routerLink="/tickets">Browse Tickets</button>
      </div>
      
      <div class="ticket-list">
        <mat-card *ngFor="let ticket of purchasedTickets" class="ticket-card" [class.luxury]="ticket.luxury">
          <mat-card-header>
            <mat-card-title>{{ ticket.from }} to {{ ticket.to }}</mat-card-title>
            <mat-card-subtitle>
              <span class="price">€{{ ticket.price }}</span>
              <span *ngIf="ticket.luxury" class="luxury-badge">LUXURY</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Purchase Date: {{ ticket.purchaseDate.toDate() | date:'medium' }}</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .my-tickets-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .loading, .no-tickets {
      text-align: center;
      margin: 50px 0;
    }
    
    .ticket-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .ticket-card {
      margin-bottom: 20px;
    }
    
    .ticket-card.luxury {
      border-left: 5px solid gold;
    }
    
    .price {
      font-weight: bold;
    }
    
    .luxury-badge {
      background-color: gold;
      color: black;
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 10px;
      font-size: 0.8rem;
    }
  `]
})
export class MyTicketsComponent implements OnInit {
  purchasedTickets: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadPurchasedTickets();
  }

  loadPurchasedTickets() {
    this.loading = true;
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userService.getPurchasedTickets(user.uid).then(tickets => {
          this.purchasedTickets = tickets;
          this.loading = false;
        }).catch(error => {
          console.error('Error loading purchased tickets:', error);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }
}
