import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { TicketListComponent } from './app/components/ticket-list/ticket-list.component';
import { MyTicketsComponent } from './app/components/my-tickets/my-tickets.component';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'my-tickets', component: MyTicketsComponent }
];


bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideHttpClient(), provideFirebaseApp(() => initializeApp({ projectId: "traintickets-b98d6", appId: "1:307051079419:web:8b4d0ad4ed072aa95fb25e", storageBucket: "traintickets-b98d6.firebasestorage.app", apiKey: "AIzaSyB9DXEas_EEIlJH8A9lAY5ZzrQ0WWCyl30", authDomain: "traintickets-b98d6.firebaseapp.com", messagingSenderId: "307051079419" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));
