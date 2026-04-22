import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, Search, Edit2, Power, PowerOff, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  PlusIcon = Plus;
  SearchIcon = Search;
  Edit2Icon = Edit2;
  PowerIcon = Power;
  PowerOffIcon = PowerOff;

  searchTerm = '';
  categoryFilter = 'all';
  priceRange = 'all';
  currentPage = 1;
  isModalOpen = false;
  itemsPerPage = 10;

  categories = ['all', 'Electrónica', 'Accesorios', 'Móviles', 'Tabletas', 'Audio', 'Wearables'];

  products = [
    { id: '1', name: 'Laptop Dell XPS 15', category: 'Electrónica', price: 1299.99, stock: 3, minStock: 10, status: 'active' },
    { id: '2', name: 'Mouse Logitech MX Master', category: 'Accesorios', price: 99.99, stock: 5, minStock: 15, status: 'active' },
    { id: '3', name: 'Teclado Mecánico RGB', category: 'Accesorios', price: 149.99, stock: 2, minStock: 8, status: 'active' },
    { id: '4', name: 'Monitor LG 27 pulgadas', category: 'Electrónica', price: 349.99, stock: 4, minStock: 12, status: 'active' },
    { id: '5', name: 'Webcam HD 1080p', category: 'Accesorios', price: 79.99, stock: 1, minStock: 10, status: 'active' }
  ];

  get filteredProducts() {
    return this.products.filter(p => p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  get paginatedProducts() {
    return this.filteredProducts.slice(0, this.itemsPerPage); // Mock pagination
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleStatus(product: any) {
    product.status = product.status === 'active' ? 'inactive' : 'active';
  }
}
