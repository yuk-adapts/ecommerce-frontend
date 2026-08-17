import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService, Order } from '../../core/services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <button class="btn btn-outline-secondary mb-3" (click)="goBack()">
        ← Back to Orders
      </button>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && order" class="card">
        <div class="card-header">
          <h4>Order #{{ order.id }}</h4>
          <span [class]="getStatusClass(order.status)">{{ order.status }}</span>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-6">
              <h5>Order Information</h5>
              <p><strong>Order ID:</strong> {{ order.id }}</p>
              <p><strong>Order Date:</strong> {{ order.createdAt | date: 'medium' }}</p>
              <p><strong>Status:</strong> 
                <span [class]="getStatusClass(order.status)">{{ order.status }}</span>
              </p>
            </div>
            <div class="col-md-6 text-end">
              <h5>Total Amount</h5>
              <h2 class="text-primary">\${{ order.totalAmount | number: '1.2-2' }}</h2>
            </div>
          </div>

          <hr>

          <h5>Order Items</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of order.items">
                  <td>{{ item.productName || 'Product #' + item.productId }}</td>
                  <td>\${{ item.price | number: '1.2-2' }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>\${{ item.subtotal | number: '1.2-2' }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="3" class="text-end">Total:</th>
                  <th>\${{ order.totalAmount | number: '1.2-2' }}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="mt-4" *ngIf="order.status === 'PENDING'">
            <button class="btn btn-danger" (click)="cancelOrder()">
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !order" class="alert alert-warning">
        Order not found.
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
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  orderId: number | null = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = parseInt(id);
        this.loadOrder(this.orderId);
      }
    });
  }

  loadOrder(orderId: number): void {
    this.loading = true;
    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
      }
    });
  }

  cancelOrder(): void {
    if (!this.orderId) return;

    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          alert('Order cancelled successfully');
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

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}

