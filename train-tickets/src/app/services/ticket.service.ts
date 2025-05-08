import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { map, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketsCollection = 'tickets';

  constructor(private firestore: Firestore) {}

  getTickets(): Observable<Ticket[]> {
    const ticketsRef = collection(this.firestore, this.ticketsCollection);
    return from(getDocs(ticketsRef)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            from: data['from'],
            to: data['to'],
            price: data['price'],
            luxury: data['luxury'],
            lastTicket: data['lastTicket']
          } as unknown as Ticket;
        });
      })
    );
  }

  addTicket(ticket: Ticket): Observable<any> {
    const ticketsRef = collection(this.firestore, this.ticketsCollection);
    return from(addDoc(ticketsRef, ticket));
  }

  updateTicket(id: string, ticket: Partial<Ticket>): Observable<any> {
    const ticketRef = doc(this.firestore, this.ticketsCollection, id);
    return from(updateDoc(ticketRef, ticket));
  }

  deleteTicket(id: string): Observable<any> {
    const ticketRef = doc(this.firestore, this.ticketsCollection, id);
    return from(deleteDoc(ticketRef));
  }
}
