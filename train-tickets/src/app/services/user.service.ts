import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async saveUserData(user: User, additionalData?: any) {
    const userRef = doc(this.firestore, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      ...additionalData
    };
    
    return setDoc(userRef, userData);
  }

  async getUserData(uid: string) {
    const userRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
}
