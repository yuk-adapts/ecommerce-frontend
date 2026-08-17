import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, Cart } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Shopping Cart</h2>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && (!cart || cart.items.length === 0)" class="alert alert-info">
        Your cart is empty. <a routerLink="/products">Continue shopping</a>
      </div>

      <div *ngIf="!loading && cart && cart.items.length > 0" class="row">
        <div class="col-md-8">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of cart.items">
                  <td>{{ item.productName }}</td>
                  <td>\${{ item.price | number : '1.2-2' }}</td>
                  <td>
                    <input
                      type="number"
                      class="form-control"
                      style="width: 80px;"
                      [(ngModel)]="item.quantity"
                      (change)="updateQuantity(item.productId, item.quantity)"
                      min="1"
                    />
                  </td>
                  <td>\${{ item.totalPrice | number : '1.2-2' }}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" (click)="removeFromCart(item.productId)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Order Summary</h5>
              <hr />
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>\${{ cart.totalPrice | number : '1.2-2' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>\${{ cart.totalPrice | number : '1.2-2' }}</strong>
              </div>
              <button class="btn btn-primary w-100" routerLink="/checkout">
                Proceed to Checkout
              </button>
              <button class="btn btn-outline-secondary w-100 mt-2" routerLink="/products">
                Continue Shopping
              </button>
              <button class="btn btn-outline-danger w-100 mt-2" (click)="clearCart()">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  removeFromCart(productId: string): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(productId).subscribe({
        next: (cart) => {
          this.cart = cart;
        },
        error: (error) => {
          console.error('Error removing item:', error);
        },
      });
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      },
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.cart = null;
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        },
      });
    }
  }
}
