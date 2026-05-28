import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Power, PowerOff, Search, Tag, LucideAngularModule } from 'lucide-angular';
import { CategoriesService, Category } from '../../services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  // Inyección de iconos Lucide
  PlusIcon = Plus;
  Edit2Icon = Edit2;
  PowerIcon = Power;
  PowerOffIcon = PowerOff;
  SearchIcon = Search;
  TagIcon = Tag;

  // Estados de control de la UI
  searchTerm = '';
  isModalOpen = false;
  editingCategory: Category | null = null;
  
  // Estructura del formulario reactivo local
  formData = {
    name: '',
    description: ''
  };

  // Buffer de datos en memoria (Sincronizado con MongoDB)
  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  // Capa de integración: Consumo de API por HTTP GET
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        // Normalización de identificadores únicos para la capa de presentación (id / _id)
        this.categories = res.map(c => ({ ...c, id: c._id || c.id }));
      },
      error: (err) => console.error('Error cargando categorías de MongoDB:', err)
    });
  }

  openModal(category?: Category) {
    if (category) {
      this.editingCategory = category;
      this.formData = { name: category.name, description: category.description };
    } else {
      this.editingCategory = null;
      this.formData = { name: '', description: '' };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Despachador transaccional del Formulario
  saveCategory() {
    if (!this.formData.name.trim() || !this.formData.description.trim()) return;

    if (this.editingCategory) {
      // Flujo de Modificación (HTTP PUT)
      const targetId = this.editingCategory.id || this.editingCategory._id;
      if (!targetId) return;

      this.categoriesService.updateCategory(targetId, this.formData).subscribe({
        next: (updated) => {
          const index = this.categories.findIndex(c => c.id === targetId);
          if (index !== -1) {
            // Reemplazo atómico en el arreglo local para refrescar la vista reactivamente
            this.categories[index] = { ...this.categories[index], ...updated };
          }
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar categoría:', err)
      });
    } else {
      // ==========================================
      // APLICACIÓN DE CORRECCIÓN A (HTTP POST)
      // ==========================================
      this.categoriesService.createCategory({
        name: this.formData.name,
        description: this.formData.description,
        status: 'active' // Inyección explícita del estado obligatorio requerido por la interfaz
      }).subscribe({
        next: (newCat) => {
          // Inserción en el pipeline visual e inicialización de metadatos volátiles
          this.categories.push({ 
            ...newCat, 
            id: newCat._id || newCat.id, 
            productCount: 0, 
            createdAt: new Date().toISOString().split('T')[0] 
          });
          this.closeModal();
        },
        error: (err) => console.error('Error al crear categoría:', err)
      });
    }
  }

  // Orquestador de cambio de estado lógico (Active/Inactive)
  toggleStatus(category: Category) {
    const nextStatus = category.status === 'active' ? 'inactive' : 'active';
    const targetId = category.id || category._id;
    if (!targetId) return;

    this.categoriesService.updateCategory(targetId, { status: nextStatus }).subscribe({
      next: () => {
        category.status = nextStatus; // Mutación en caliente de la UI tras confirmación del backend
      },
      error: (err) => console.error('Error al cambiar estado:', err)
    });
  }

  // ==========================================
  // GETTERS DE PROCESAMIENTO REACTIVO (DATA-BINDING)
  // ==========================================
  get filteredCategories(): Category[] {
    return this.categories.filter(c => 
      c.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get activeCategories(): Category[] {
    return this.categories.filter(c => c.status === 'active');
  }

  get totalProducts(): number {
    return this.categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
  }

  get averageProducts(): number {
    if (this.categories.length === 0) return 0;
    return Math.round(this.totalProducts / this.categories.length);
  }
}