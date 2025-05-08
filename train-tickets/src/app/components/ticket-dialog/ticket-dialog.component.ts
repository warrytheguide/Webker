import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Ticket' : 'Add New Ticket' }}</h2>
    <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>From</mat-label>
          <input matInput formControlName="from" required>
          <mat-error *ngIf="ticketForm.get('from')?.hasError('required')">
            Origin city is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>To</mat-label>
          <input matInput formControlName="to" required>
          <mat-error *ngIf="ticketForm.get('to')?.hasError('required')">
            Destination city is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price (€)</mat-label>
          <input matInput type="number" formControlName="price" required>
          <mat-error *ngIf="ticketForm.get('price')?.hasError('required')">
            Price is required
          </mat-error>
          <mat-error *ngIf="ticketForm.get('price')?.hasError('min')">
            Price must be greater than 0
          </mat-error>
        </mat-form-field>
        
        <div class="checkbox-group">
          <mat-checkbox formControlName="luxury">Luxury Train</mat-checkbox>
          <mat-checkbox formControlName="lastTicket">Last Ticket Available</mat-checkbox>
        </div>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="ticketForm.invalid">
          {{ data ? 'Update' : 'Add' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .checkbox-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
    }
    mat-checkbox {
      margin-bottom: 10px;
    }
  `]
})
export class TicketDialogComponent {
  ticketForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ticket | null
  ) {
    this.ticketForm = this.fb.group({
      from: [data?.from || '', Validators.required],
      to: [data?.to || '', Validators.required],
      price: [data?.price || 0, [Validators.required, Validators.min(1)]],
      luxury: [data?.luxury || false],
      lastTicket: [data?.lastTicket || false]
    });
  }
  
  onSubmit() {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      
      if (this.data) {
        ticketData.id = this.data.id;
      }
      
      this.dialogRef.close(ticketData);
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
