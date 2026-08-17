import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card">
            <div class="card-body p-4">
              <h3 class="card-title mb-4 text-center">Login</h3>

              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    placeholder="Enter your email"
                  />
                  <div
                    *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                    class="text-danger small mt-1"
                  >
                    Please enter a valid email
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    placeholder="Enter your password"
                  />
                  <div
                    *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    class="text-danger small mt-1"
                  >
                    Password is required
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  [disabled]="loginForm.invalid || loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </form>

              <div class="mt-3 text-center">
                <p>
                  Don't have an account?
                  <a routerLink="/auth/register">Register here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.token) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || error.message || 'Login failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
