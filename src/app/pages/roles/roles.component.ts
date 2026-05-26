import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Power, PowerOff, Search, Shield, Check, X, LucideAngularModule, Pen } from 'lucide-angular';
import { RoleService } from '../../services/role.service';
import { ToastService } from '../../components/toast/toast.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  PlusIcon = Plus;
  Edit2Icon = Pen;
  PowerIcon = Power;
  PowerOffIcon = PowerOff;
  SearchIcon = Search;
  ShieldIcon = Shield;
  CheckIcon = Check;
  XIcon = X;

  isAdmin = false;
  searchTerm = '';
  isModalOpen = false;
  editingRole: any = null;
  formData: any = { name: '', description: '', permissions: [] };

  availablePermissions = [
    { id: 'dashboard_view', name: 'Ver Dashboard', description: 'Acceso a la vista principal', module: 'Dashboard' },
    { id: 'products_view', name: 'Ver Productos', description: 'Visualizar listado', module: 'Productos' },
    { id: 'products_edit', name: 'Editar Productos', description: 'Modificar información', module: 'Productos' },
    { id: 'categories_manage', name: 'Gestionar Categorías', description: 'Crear, editar y eliminar', module: 'Categorías' },
    { id: 'movements_create', name: 'Registrar Movimientos', description: 'Registrar entradas y salidas', module: 'Movimientos' },
    { id: 'alerts_manage', name: 'Gestionar Alertas', description: 'Marcar como leídas', module: 'Alertas' },
    { id: 'users_manage', name: 'Gestionar Usuarios', description: 'Crear, editar usuarios', module: 'Usuarios' },
    { id: 'roles_manage', name: 'Gestionar Roles', description: 'Crear, editar roles', module: 'Roles' },
  ];

  roles: any[] = [];

  constructor(
    private roleService: RoleService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : {};
    this.isAdmin = currentUser.role === 'Administrador';
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => this.toast.error('Error al cargar roles')
    });
  }

  get filteredRoles() {
    return this.roles.filter(r =>
      r.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get activeRolesCount() {
    return this.roles.filter(r => r.status === 'active').length;
  }

  get totalUsers() {
    return this.roles.reduce((sum, r) => sum + (r.userCount || 0), 0);
  }

  get permissionsByModule() {
    return this.availablePermissions.reduce((acc: any, permission) => {
      if (!acc[permission.module]) acc[permission.module] = [];
      acc[permission.module].push(permission);
      return acc;
    }, {});
  }

  getModuleKeys() {
    return Object.keys(this.permissionsByModule);
  }

  hasPermission(id: string) {
    return this.formData.permissions.includes(id);
  }

  isModuleAllSelected(module: string) {
    const perms = this.permissionsByModule[module].map((p: any) => p.id);
    return perms.every((p: string) => this.formData.permissions.includes(p));
  }

  togglePermission(id: string) {
    if (this.formData.permissions.includes(id)) {
      this.formData.permissions = this.formData.permissions.filter((p: string) => p !== id);
    } else {
      this.formData.permissions.push(id);
    }
  }

  toggleModulePermissions(module: string) {
    const perms = this.permissionsByModule[module].map((p: any) => p.id);
    if (this.isModuleAllSelected(module)) {
      this.formData.permissions = this.formData.permissions.filter((p: string) => !perms.includes(p));
    } else {
      this.formData.permissions = [...new Set([...this.formData.permissions, ...perms])];
    }
  }

  openModal(role?: any) {
    if (role) {
      this.editingRole = role;
      this.formData = { name: role.name, description: role.description, permissions: [...role.permissions] };
    } else {
      this.editingRole = null;
      this.formData = { name: '', description: '', permissions: [] };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveRole() {
    if (!this.formData.name || !this.formData.description || this.formData.permissions.length === 0) return;

    if (this.editingRole) {
      this.roleService.updateRole(this.editingRole._id, this.formData).subscribe({
        next: () => {
          this.toast.success('Rol actualizado correctamente');
          this.loadRoles();
          this.closeModal();
        },
        error: (err) => this.toast.error(err.error?.message || 'Error al actualizar')
      });
    } else {
      this.roleService.createRole(this.formData).subscribe({
        next: () => {
          this.toast.success('Rol creado correctamente');
          this.loadRoles();
          this.closeModal();
        },
        error: (err) => this.toast.error(err.error?.message || 'Error al crear')
      });
    }
  }

  toggleStatus(role: any) {
    this.roleService.toggleRoleStatus(role._id).subscribe({
      next: (updated) => {
        role.status = updated.status;
        this.toast.success('Estado actualizado');
      },
      error: (err) => this.toast.error('Error al cambiar el estado')
    });
  }
}
