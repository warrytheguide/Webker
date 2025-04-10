import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private USERS_KEY = 'users_data';

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.USERS_KEY)) {
      this.http.get<User[]>('assets/data/users.json').subscribe(users => {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      });
    }
    
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    const users = this.getUsers();
    
    const user = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (!user) {
      return throwError(() => new Error('Username or password is incorrect'));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return of(user);
  }

  register(newUser: Partial<User>): Observable<User> {
    const users = this.getUsers();
    
    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
      return throwError(() => new Error('Username already exists'));
    }
    
    const maxId = users.length > 0 
      ? Math.max(...users.map(user => user.id)) 
      : 0;
      
    const user: User = {
      id: maxId + 1,
      username: newUser.username!,
      password: newUser.password!,
      admin: false
    };
    
    users.push(user);
    this.saveUsers(users);
    
    return of(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.admin === true;
  }
}
