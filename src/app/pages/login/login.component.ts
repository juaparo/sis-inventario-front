import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, Package } from 'lucide-angular';
import { ToastService } from '../../components/toast/toast.service';
import { AuthService } from '../../services/auth.service';

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
  errors = { email: '', password: '', general: '' };
  isLoading = false;
  
  forgotPasswordMode = false;
  simulatedUrl = '';
  successMessage = '';

  constructor(
    private router: Router, 
    private toast: ToastService,
    private authService: AuthService
  ) {}

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

    this.errors = { ...this.errors, ...newErrors };
    return isValid;
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.toast.success(`¡Bienvenido ${response.user.name}!`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Credenciales incorrectas');
        this.errors.password = 'Correo o contraseña incorrectos';
      }
    });
  }

  handleForgotPassword() {
    this.errors.email = '';
    this.successMessage = '';
    
    if (!this.email) {
      this.errors.email = 'Por favor ingresa tu correo';
      return;
    }
    
    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        if (res.simulatedEmailUrl) {
          this.simulatedUrl = res.simulatedEmailUrl;
        }
      },
      error: (err) => {
        this.isLoading = false;
        // Mostramos éxito igual por seguridad (evitar enumeración de usuarios)
        this.successMessage = 'Si el correo existe, se ha generado un enlace de recuperación';
      }
    });
  }
}
