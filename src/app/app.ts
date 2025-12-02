
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActiveTransactions } from './active-transactions/active-transactions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ActiveTransactions],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cello-dashboard');
}
