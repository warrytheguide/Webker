// src/app/components/train-ticket/train-ticket.component.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { ConfirmDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-train-ticket',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './train-ticket.component.html',
  styleUrls: ['./train-ticket.component.scss']
})
export class TrainTicketComponent implements OnInit {
  @Input() ticket!: Ticket;
  @Output() ticketUpdated = new EventEmitter<void>();
  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is admin
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.email === 'admin@admin.com';
    });
  }

  buyTicket() {
    // Check if user is logged in
    if (!this.isLoggedIn) {
      this.snackBar.open('Please login first to buy tickets', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      this.router.navigate(['/login']);
      return;
    }

    // Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Purchase',
        message: `Are you sure you want to buy a ticket from ${this.ticket.from} to ${this.ticket.to} for €${this.ticket.price}?`,
        confirmText: 'Buy',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processPurchase();
      }
    });
  }

  processPurchase() {
    // Get current user
    this.authService.user$.subscribe(user => {
      if (user) {
        // Add ticket to user's purchased tickets
        this.userService.addPurchasedTicket(user.uid, this.ticket).then(() => {
          this.snackBar.open('Ticket purchased successfully!', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          
          // If it was the last ticket, delete it from available tickets
          if (this.ticket.lastTicket) {
            this.ticketService.deleteTicket(this.ticket.id.toString()).subscribe({
              next: () => {
                this.ticketUpdated.emit(); // Refresh ticket list
              },
              error: (error) => {
                console.error('Error deleting last ticket:', error);
              }
            });
          }
        }).catch(error => {
          console.error('Error adding ticket to user profile:', error);
          this.snackBar.open('Error purchasing ticket', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        });
      }
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
