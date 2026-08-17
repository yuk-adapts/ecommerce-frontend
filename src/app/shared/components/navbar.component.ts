import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-shopping-cart"></i> eCommerce Store
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active"> Products </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                <i class="fas fa-shopping-bag"></i> Cart
              </a>
            </li>
            <ng-container *ngIf="currentUser$ | async; let user">
              <li class="nav-item">
                <a class="nav-link" routerLink="/orders" routerLinkActive="active"> Orders </a>
              </li>
              <li class="nav-item">
                <span class="nav-link">{{ user?.email }}</span>
              </li>
              <li class="nav-item">
                <a class="nav-link" (click)="logout()" style="cursor: pointer;"> Logout </a>
              </li>
            </ng-container>
            <ng-container *ngIf="!(currentUser$ | async)">
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login" routerLinkActive="active"> Login </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/register" routerLinkActive="active">
                  Register
                </a>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .navbar-brand {
        font-weight: bold;
        font-size: 1.25rem;
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  currentUser$: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
