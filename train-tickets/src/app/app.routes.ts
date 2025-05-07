import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { authGuard } from './guards/auth.guard';
import { nonAuthGuard } from './guards/non-auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { 
      path: 'login', 
      component: LoginComponent,
      canActivate: [nonAuthGuard]
    },
    { 
      path: 'register', 
      component: RegisterComponent,
      canActivate: [nonAuthGuard]
    },
    { path: 'tickets', component: TicketListComponent },
    { 
      path: 'my-tickets', 
      component: MyTicketsComponent,
      canActivate: [authGuard]
    }
  ];
