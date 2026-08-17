import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, Cart } from '../../core/services/cart.service';
import { OrderService, CreateOrderRequest } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Checkout</h2>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && (!cart || cart.items.length === 0)" class="alert alert-warning">
        Your cart is empty. <a routerLink="/products">Continue shopping</a>
      </div>

      <div *ngIf="!loading && cart && cart.items.length > 0" class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h5>Order Summary</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of cart.items">
                      <td>{{ item.productName }}</td>
                      <td>\${{ item.price | number: '1.2-2' }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>\${{ (item.price * item.quantity) | number: '1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>Payment Information</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>\${{ cart.totalPrice | number: '1.2-2' }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>\${{ cart.totalPrice | number: '1.2-2' }}</strong>
              </div>

              <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="paymentMethod" class="form-label">Payment Method</label>
                  <select class="form-select" id="paymentMethod" formControlName="paymentMethod">
                    <option value="">Select payment method</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                  <div *ngIf="paymentForm.get('paymentMethod')?.invalid && paymentForm.get('paymentMethod')?.touched" 
                       class="text-danger small mt-1">
                    Please select a payment method
                  </div>
                </div>

                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>

                <button type="submit" class="btn btn-primary w-100" 
                        [disabled]="paymentForm.invalid || processing">
                  <span *ngIf="processing" class="spinner-border spinner-border-sm me-2"></span>
                  {{ processing ? 'Processing...' : 'Place Order' }}
                </button>
              </form>

              <button class="btn btn-outline-secondary w-100 mt-2" routerLink="/cart">
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 1rem;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = true;
  processing: boolean = false;
  errorMessage: string | null = null;
  paymentForm: FormGroup;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
        if (!cart || cart.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid || !this.cart) return;

    this.processing = true;
    this.errorMessage = null;

    // Convert cart items to order items
    const orderItems = this.cart.items.map(item => ({
      productId: parseInt(item.productId),
      quantity: item.quantity
    }));

    const orderRequest: CreateOrderRequest = {
      items: orderItems
    };

    // Create order
    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        // Process payment
        this.orderService.processPayment(order.id, this.paymentForm.value.paymentMethod).subscribe({
          next: (completedOrder) => {
            // Clear cart after successful order
            this.cartService.clearCart().subscribe();
            // Redirect to order confirmation
            this.router.navigate(['/orders', completedOrder.id]);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Payment processing failed. Please try again.';
            this.processing = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create order. Please try again.';
        this.processing = false;
      }
    });
  }
}

