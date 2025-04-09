import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { TicketListComponent } from './app/components/ticket-list/ticket-list.component';
import { MyTicketsComponent } from './app/components/my-tickets/my-tickets.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-tickets', component: MyTicketsComponent }
];


bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
