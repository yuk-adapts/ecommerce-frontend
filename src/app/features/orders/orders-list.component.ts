import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>My Orders</h2>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && orders.length === 0" class="alert alert-info">
        You have no orders yet. <a routerLink="/products">Start shopping</a>
      </div>

      <div *ngIf="!loading && orders.length > 0">
        <div class="card mb-3" *ngFor="let order of orders">
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h5 class="card-title">Order #{{ order.id }}</h5>
                <p class="text-muted mb-2">
                  <strong>Status:</strong> 
                  <span [class]="getStatusClass(order.status)">{{ order.status }}</span>
                </p>
                <p class="text-muted mb-2">
                  <strong>Date:</strong> {{ order.createdAt | date: 'medium' }}
                </p>
                <p class="mb-0">
                  <strong>Items:</strong> {{ order.items.length }} item(s)
                </p>
              </div>
              <div class="col-md-4 text-end">
                <h4 class="text-primary">\${{ order.totalAmount | number: '1.2-2' }}</h4>
                <button class="btn btn-outline-primary mt-2" [routerLink]="['/orders', order.id]">
                  View Details
                </button>
                <button *ngIf="order.status === 'PENDING'" 
                        class="btn btn-outline-danger mt-2 ms-2" 
                        (click)="cancelOrder(order.id)">
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-pending {
      color: #ffc107;
      font-weight: bold;
    }
    .status-paid {
      color: #28a745;
      font-weight: bold;
    }
    .status-cancelled {
      color: #dc3545;
      font-weight: bold;
    }
    .status-processing {
      color: #17a2b8;
      font-weight: bold;
    }
  `]
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        // Sort orders by date, newest first
        this.orders = orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders(); // Reload orders
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'pending') return 'status-pending';
    if (statusLower === 'paid' || statusLower === 'completed') return 'status-paid';
    if (statusLower === 'cancelled') return 'status-cancelled';
    if (statusLower === 'processing') return 'status-processing';
    return '';
  }
}

