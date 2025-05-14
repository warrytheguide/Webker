import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  // Save user data to Firestore
  async saveUserData(user: User, additionalData?: any) {
    const userRef = doc(this.firestore, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      purchasedTickets: [],
      ...additionalData
    };
    
    return setDoc(userRef, userData);
  }

  // Get user data from Firestore
  async getUserData(uid: string) {
    const userRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  // Add a purchased ticket to user's profile
  async addPurchasedTicket(uid: string, ticket: Ticket) {
    const userRef = doc(this.firestore, 'users', uid);
    
    // Add purchase timestamp
    const purchasedTicket = {
      ...ticket,
      purchaseDate: new Date()
    };
    
    return updateDoc(userRef, {
      purchasedTickets: arrayUnion(purchasedTicket)
    });
  }

  // Get user's purchased tickets
  async getPurchasedTickets(uid: string) {
    const userData = await this.getUserData(uid);
    return userData?.['purchasedTickets'] || [];
  }
}
