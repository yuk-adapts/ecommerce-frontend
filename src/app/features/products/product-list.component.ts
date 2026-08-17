import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventoryService, Product } from '../../core/services/inventory.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-md-6">
          <h2>Products</h2>
        </div>
        <div class="col-md-6 d-flex align-items-center">
          <input
            type="text"
            class="form-control"
            placeholder="Search products..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
          />
        </div>
      </div>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && filteredProducts.length === 0" class="alert alert-info">
        No products found
      </div>

      <div class="row" *ngIf="!loading">
        <div class="col-md-4 mb-4" *ngFor="let product of filteredProducts">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <p class="text-muted">Category: {{ product.category }}</p>
              <h4 class="text-primary">\${{ product.price | number : '1.2-2' }}</h4>
              <p class="text-success" *ngIf="product.availableQuantity > 0">Stock: {{ product.availableQuantity }}</p>
              <p class="text-danger" *ngIf="!product.inStock">Out of Stock</p>
            </div>
            <div class="card-footer bg-light">
              <button
                class="btn btn-sm btn-primary w-100"
                (click)="addToCart(product)"
                [disabled]="!product.inStock"
              >
                <i class="fas fa-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        transition: transform 0.2s;
      }
      .card:hover {
        transform: translateY(-5px);
      }
    `,
  ],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  constructor(private inventoryService: InventoryService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.inventoryService.getAllProducts().subscribe({
      next: (response) => {
        console.log('[ProductList] Raw API response:', response);
        console.log('[ProductList] Response type:', typeof response);
        console.log('[ProductList] Is array:', Array.isArray(response));
        
        // Handle both array and wrapped responses
        let products: Product[];
        if (Array.isArray(response)) {
          products = response;
        } else if (response && typeof response === 'object') {
          // Check for common wrapper properties
          products = (response as any).content || (response as any).data || (response as any).products || [response];
        } else {
          products = [];
        }
        
        console.log('[ProductList] Parsed products:', products);
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (p) => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term))
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(String(product.id), 1).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
      },
    });
  }
}
