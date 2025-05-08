import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Observable, from, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  
  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => {
        if (!user) return false;
        return user.email === 'admin@admin.com';
      })
    );
  }
}
