import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, ArrowDownCircle, ArrowUpCircle, Search, LucideAngularModule } from 'lucide-angular';
import { MovementsService } from '../../services/movements.service';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {
  PlusIcon = Plus;
  ArrowDownCircleIcon = ArrowDownCircle;
  ArrowUpCircleIcon = ArrowUpCircle;
  SearchIcon = Search;

  isModalOpen = false;
  searchTerm = '';
  
  formData: any = {
    product: '',
    type: 'ENTRADA',
    quantity: '',
    reason: 'Ajuste de inventario',
    supplier: ''
  };

  products: any[] = [];
  movements: any[] = [];
  currentUser: any;

  constructor(
    private movementsService: MovementsService,
    private productsService: ProductsService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getUser();
  }

  ngOnInit() {
    this.loadProducts();
    this.loadMovements();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
  }

  loadMovements() {
    this.movementsService.getMovements().subscribe({
      next: (data) => this.movements = data,
      error: (err) => console.error('Error loading movements', err)
    });
  }

  get filteredMovements() {
    return this.movements.filter((m) =>
      m.product?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false
    );
  }

  openModal(type: 'ENTRADA' | 'SALIDA') {
    this.formData.type = type;
    this.formData.product = '';
    this.formData.quantity = '';
    this.formData.reason = type === 'ENTRADA' ? 'Compra de inventario' : 'Venta o ajuste';
    this.formData.supplier = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMovement() {
    if (!this.formData.product || !this.formData.quantity || !this.formData.reason) return;
    
    const payload = {
      ...this.formData,
      user: this.currentUser?.id
    };

    this.movementsService.createMovement(payload).subscribe({
      next: () => {
        this.closeModal();
        this.loadMovements();
        this.loadProducts();
      },
      error: (err) => alert(err.error?.message || 'Error al guardar movimiento')
    });
  }
}
