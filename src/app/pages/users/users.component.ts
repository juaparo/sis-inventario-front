import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Power, PowerOff, Search, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  PlusIcon = Plus;
  Edit2Icon = Edit2;
  PowerIcon = Power;
  PowerOffIcon = PowerOff;
  SearchIcon = Search;

  isAdmin = false;
  searchTerm = '';
  isModalOpen = false;
  editingUser: any = null;
  
  formData: any = {
    name: '',
    email: '',
    role: 'Auxiliar de Bodega',
    password: ''
  };

  users = [
    { id: '1', name: 'Juan Pérez', email: 'admin@inventario.com', role: 'Administrador', status: 'active' },
    { id: '2', name: 'María García', email: 'auxiliar@inventario.com', role: 'Auxiliar de Bodega', status: 'active' },
    { id: '3', name: 'Carlos López', email: 'gerente@inventario.com', role: 'Gerente', status: 'active' },
    { id: '4', name: 'Ana Martínez', email: 'ana.martinez@inventario.com', role: 'Auxiliar de Bodega', status: 'active' },
    { id: '5', name: 'Pedro Sánchez', email: 'pedro.sanchez@inventario.com', role: 'Gerente', status: 'inactive' }
  ];

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : {};
    this.isAdmin = currentUser.role === 'Administrador';
  }

  get filteredUsers() {
    return this.users.filter(u => 
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get activeUsersCount() {
    return this.users.filter(u => u.status === 'active').length;
  }

  get adminCount() {
    return this.users.filter(u => u.role === 'Administrador').length;
  }

  get auxiliarCount() {
    return this.users.filter(u => u.role === 'Auxiliar de Bodega').length;
  }

  openModal(user?: any) {
    if (user) {
      this.editingUser = user;
      this.formData = { name: user.name, email: user.email, role: user.role, password: '' };
    } else {
      this.editingUser = null;
      this.formData = { name: '', email: '', role: 'Auxiliar de Bodega', password: '' };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    if (!this.formData.name || !this.formData.email || !this.formData.role) return;
    this.closeModal();
  }

  toggleStatus(user: any) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
  }
}
