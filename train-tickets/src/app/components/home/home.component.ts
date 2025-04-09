import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  redirectToVideo() {
    window.open('https://www.youtube.com/watch?v=rm8073qYY8k', '_blank');
  }
}
