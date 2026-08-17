import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card">
            <div class="card-body p-4">
              <h3 class="card-title mb-4 text-center">Create Account</h3>

              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    formControlName="name"
                    placeholder="Enter your full name"
                  />
                  <div
                    *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                    class="text-danger small mt-1"
                  >
                    Name is required
                  </div>
                </div>

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
                    *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
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
                    *ngIf="
                      registerForm.get('password')?.invalid && registerForm.get('password')?.touched
                    "
                    class="text-danger small mt-1"
                  >
                    Password must be at least 6 characters
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    placeholder="Confirm your password"
                  />
                  <div
                    *ngIf="
                      registerForm.get('confirmPassword')?.invalid &&
                      registerForm.get('confirmPassword')?.touched
                    "
                    class="text-danger small mt-1"
                  >
                    Please confirm your password
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  [disabled]="registerForm.invalid || loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creating Account...' : 'Register' }}
                </button>
              </form>

              <div class="mt-3 text-center">
                <p>
                  Already have an account?
                  <a routerLink="/auth/login">Login here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { name, email, password } = this.registerForm.value;
    this.authService.register({ name, email, password }).subscribe({
      next: (response) => {
        if (response.token) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || error.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
