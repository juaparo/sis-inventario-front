import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Power, PowerOff, Search, Tag, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  PlusIcon = Plus;
  Edit2Icon = Edit2;
  PowerIcon = Power;
  PowerOffIcon = PowerOff;
  SearchIcon = Search;
  TagIcon = Tag;

  searchTerm = '';
  isModalOpen = false;
  editingCategory: any = null;
  
  formData = {
    name: '',
    description: ''
  };

  categories = [
    { id: '1', name: 'Electrónica', description: 'Productos electrónicos y tecnológicos de alta gama', productCount: 45, status: 'active', createdAt: '2026-01-15' },
    { id: '2', name: 'Accesorios', description: 'Accesorios y periféricos para computadoras', productCount: 78, status: 'active', createdAt: '2026-01-20' },
    { id: '3', name: 'Móviles', description: 'Teléfonos inteligentes y dispositivos móviles', productCount: 32, status: 'active', createdAt: '2026-02-01' },
    { id: '4', name: 'Tabletas', description: 'Tablets y dispositivos tipo iPad', productCount: 18, status: 'active', createdAt: '2026-02-10' },
    { id: '5', name: 'Audio', description: 'Auriculares, altavoces y equipos de audio', productCount: 55, status: 'active', createdAt: '2026-02-15' },
    { id: '6', name: 'Wearables', description: 'Smartwatches y dispositivos vestibles', productCount: 24, status: 'active', createdAt: '2026-03-01' },
    { id: '7', name: 'Gaming', description: 'Consolas, videojuegos y accesorios gaming', productCount: 12, status: 'inactive', createdAt: '2026-03-05' },
    { id: '8', name: 'Oficina', description: 'Material de oficina y papelería', productCount: 36, status: 'active', createdAt: '2026-03-10' }
  ];

  get filteredCategories() {
    return this.categories.filter(c => 
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get activeCategories() {
    return this.categories.filter(c => c.status === 'active');
  }

  get totalProducts() {
    return this.categories.reduce((sum, c) => sum + c.productCount, 0);
  }

  get averageProducts() {
    if (this.categories.length === 0) return 0;
    return Math.round(this.totalProducts / this.categories.length);
  }

  openModal(category?: any) {
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

  saveCategory() {
    if (!this.formData.name || !this.formData.description) return;
    this.closeModal();
  }

  toggleStatus(category: any) {
    category.status = category.status === 'active' ? 'inactive' : 'active';
  }
}
