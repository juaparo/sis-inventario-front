import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, ArrowDownCircle, ArrowUpCircle, Search, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent {
  PlusIcon = Plus;
  ArrowDownCircleIcon = ArrowDownCircle;
  ArrowUpCircleIcon = ArrowUpCircle;
  SearchIcon = Search;

  isModalOpen = false;
  searchTerm = '';
  
  formData: any = {
    product: '',
    type: 'Entrada',
    quantity: ''
  };

  products = [
    { id: "1", name: "Laptop Dell XPS 15", stock: 3 },
    { id: "2", name: "Mouse Logitech MX Master", stock: 5 },
    { id: "3", name: "iPhone 14 Pro", stock: 45 },
    { id: "4", name: "MacBook Pro M3", stock: 12 },
    { id: "5", name: "iPad Air", stock: 28 },
  ];

  movements = [
    { id: "1", product: "iPhone 14 Pro", type: "Entrada", quantity: 50, user: "Juan Pérez", date: "2026-03-03 10:30" },
    { id: "2", product: "MacBook Pro M3", type: "Salida", quantity: 15, user: "María García", date: "2026-03-03 09:15" },
    { id: "3", product: "iPad Air", type: "Entrada", quantity: 30, user: "Juan Pérez", date: "2026-03-03 08:45" },
    { id: "4", product: "AirPods Pro", type: "Salida", quantity: 25, user: "Carlos López", date: "2026-03-02 16:20" },
    { id: "5", product: "Apple Watch Series 9", type: "Entrada", quantity: 40, user: "Juan Pérez", date: "2026-03-02 14:00" },
    { id: "6", product: "Laptop Dell XPS 15", type: "Salida", quantity: 8, user: "María García", date: "2026-03-02 11:30" },
    { id: "7", product: "Monitor LG 27 pulgadas", type: "Entrada", quantity: 20, user: "Juan Pérez", date: "2026-03-01 15:45" },
    { id: "8", product: "Teclado Mecánico RGB", type: "Salida", quantity: 12, user: "Carlos López", date: "2026-03-01 13:20" },
  ];

  get filteredMovements() {
    return this.movements.filter((m) =>
      m.product.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openModal(type: 'Entrada' | 'Salida') {
    this.formData.type = type;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMovement() {
    if (!this.formData.product || !this.formData.quantity) return;
    this.closeModal();
  }
}
