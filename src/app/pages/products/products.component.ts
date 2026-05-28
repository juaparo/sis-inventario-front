import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Plus, Search, Edit2, Trash2, Power, PowerOff, LucideAngularModule } from 'lucide-angular';
import { CategoriesService, Category } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service'; // Inyección del servicio de persistencia
import { AuthService } from '../../services/auth.service';

export interface Product {
  id?: string;
  _id?: string; // Mapeo del ID primario autogenerado de MongoDB
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService); // Core HTTP
  public authService = inject(AuthService);

  PlusIcon = Plus;
  SearchIcon = Search;
  Edit2Icon = Edit2;
  TrashIcon = Trash2;
  PowerIcon = Power;
  PowerOffIcon = PowerOff;

  searchTerm = '';
  categoryFilter = 'all';
  currentPage = 1;
  isModalOpen = false;
  itemsPerPage = 10;

  isEditing = false;
  editingProductId: string | null = null;

  categories: Category[] = [];
  products: Product[] = []; // Inicia vacío, se poblará desde MongoDB

  productFormData = {
    name: '',
    category: '',
    price: null as number | null,
    stock: null as number | null,
    minStock: null as number | null
  };

  ngOnInit(): void {
    this.loadActiveCategories();
    this.loadRealProducts(); // Carga inicial al levantar la vista
  }

  loadActiveCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => this.categories = res.filter(c => c.status === 'active'),
      error: (err) => console.error('Fallo en API de Categorías:', err)
    });
  }

  // READ: Consumir GET /api/products
  loadRealProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => console.error('Error al leer el inventario de la BD:', err)
    });
  }

  openModal() {
    this.isEditing = false;
    this.editingProductId = null;
    this.productFormData = { name: '', category: '', price: null, stock: null, minStock: null };
    this.isModalOpen = true;
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.editingProductId = product._id || product.id || null;
    
    this.productFormData = {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CREATE / UPDATE: Conexión asíncrona real
  saveProduct() {
    const payload: Partial<Product> = {
      name: this.productFormData.name,
      category: this.productFormData.category,
      price: this.productFormData.price ? Number(this.productFormData.price) : 0,
      stock: this.productFormData.stock ? Number(this.productFormData.stock) : 0,
      minStock: this.productFormData.minStock ? Number(this.productFormData.minStock) : 0,
      status: 'active'
    };

    if (this.isEditing && this.editingProductId) {
      // Petición HTTP PUT para actualización en Mongo
      this.productsService.updateProduct(this.editingProductId, payload).subscribe({
        next: (productoActualizado) => {
          this.products = this.products.map(p => 
            (p._id === this.editingProductId || p.id === this.editingProductId) ? productoActualizado : p
          );
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar en MongoDB:', err)
      });
    } else {
      // Petición HTTP POST para inserción física en Mongo
      this.productsService.createProduct(payload).subscribe({
        next: (productoGuardado) => {
          // El backend responde con el objeto persistido y su respectivo _id
          this.products = [...this.products, productoGuardado];
          this.closeModal();
        },
        error: (err) => console.error('Error al guardar en MongoDB:', err)
      });
    }
  }

  // UPDATE de Estado (Toggle)
  toggleStatus(product: Product) {
    const targetId = product._id || product.id;
    if (!targetId) return;

    const nuevoEstado = product.status === 'active' ? 'inactive' : 'active';

    this.productsService.updateProduct(targetId, { status: nuevoEstado }).subscribe({
      next: (res) => {
        product.status = res.status;
      },
      error: (err) => console.error('Error al cambiar estado en la BD:', err)
    });
  }

  // DELETE: Consumir DELETE /api/products/:id
  deleteProduct(product: Product) {
    const targetId = product._id || product.id;
    if (!targetId) return;

    if (confirm(`¿Está seguro de eliminar de la base de datos el producto "${product.name}"?`)) {
      this.productsService.deleteProduct(targetId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== targetId && p.id !== targetId);
        },
        error: (err) => console.error('Error al eliminar de MongoDB:', err)
      });
    }
  }

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.categoryFilter === 'all' || p.category === this.categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }
}