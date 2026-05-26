import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Power, PowerOff, Search, LucideAngularModule } from 'lucide-angular';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { ToastService } from '../../components/toast/toast.service';

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
    role: '',
    password: ''
  };

  users: any[] = [];
  roles: any[] = [];

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : {};
    this.isAdmin = currentUser.role === 'Administrador';
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => this.toast.error('Error al cargar usuarios')
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        if (this.roles.length > 0 && !this.formData.role) {
          this.formData.role = this.roles[0]._id;
        }
      },
      error: (err) => console.error('Error al cargar roles', err)
    });
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
    return this.users.filter(u => u.role?.name === 'Administrador').length;
  }

  get auxiliarCount() {
    return this.users.filter(u => u.role?.name === 'Auxiliar de Bodega').length;
  }

  openModal(user?: any) {
    if (user) {
      this.editingUser = user;
      this.formData = { name: user.name, email: user.email, role: user.role?._id || user.role, password: '' };
    } else {
      this.editingUser = null;
      this.formData = { name: '', email: '', role: this.roles.length ? this.roles[0]._id : '', password: '' };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    if (!this.formData.name || !this.formData.email || !this.formData.role) return;

    if (this.editingUser) {
      const updateData = { ...this.formData };
      if (!updateData.password) delete updateData.password;

      this.userService.updateUser(this.editingUser._id, updateData).subscribe({
        next: () => {
          this.toast.success('Usuario actualizado correctamente');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => this.toast.error(err.error?.message || 'Error al actualizar')
      });
    } else {
      if (!this.formData.password) {
        this.toast.error('La contraseña es requerida para nuevos usuarios');
        return;
      }
      this.userService.createUser(this.formData).subscribe({
        next: () => {
          this.toast.success('Usuario creado correctamente');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => this.toast.error(err.error?.message || 'Error al crear')
      });
    }
  }

  toggleStatus(user: any) {
    this.userService.toggleUserStatus(user._id).subscribe({
      next: (updated) => {
        user.status = updated.status;
        this.toast.success('Estado actualizado');
      },
      error: (err) => this.toast.error('Error al cambiar el estado')
    });
  }
}
