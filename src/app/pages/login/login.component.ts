import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, Package } from 'lucide-angular';
import { ToastService } from '../../components/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly PackageIcon = Package;

  email = '';
  password = '';
  showPassword = false;
  errors = { email: '', password: '' };

  constructor(private router: Router, private toast: ToastService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateForm() {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!this.email) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      newErrors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    if (!this.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (this.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    this.errors = newErrors;
    return isValid;
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const users = [
      { email: 'admin@inventario.com', password: 'admin123', name: 'Juan Pérez', role: 'Administrador' },
      { email: 'auxiliar@inventario.com', password: 'auxiliar123', name: 'María García', role: 'Auxiliar de Bodega' },
      { email: 'gerente@inventario.com', password: 'gerente123', name: 'Carlos López', role: 'Gerente' },
    ];

    const user = users.find((u) => u.email === this.email && u.password === this.password);

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      this.toast.success(`¡Bienvenido ${user.name}!`);
      this.router.navigate(['/']);
    } else {
      this.toast.error('Credenciales incorrectas');
      this.errors.password = 'Correo o contraseña incorrectos';
    }
  }
}
