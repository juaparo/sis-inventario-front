import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Package, Eye, EyeOff, CheckCircle2, XCircle, LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly PackageIcon = Package;
  readonly CheckIcon = CheckCircle2;
  readonly XIcon = XCircle;

  token = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  rules = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };
  
  error = '';
  success = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.error = 'Token inválido o no encontrado';
    }
  }

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') this.showPassword = !this.showPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePassword() {
    this.rules.length = this.password.length >= 8;
    this.rules.upper = /[A-Z]/.test(this.password);
    this.rules.lower = /[a-z]/.test(this.password);
    this.rules.number = /[0-9]/.test(this.password);
    this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
  }

  isPasswordValid() {
    return Object.values(this.rules).every(Boolean);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.error = '';
    
    if (!this.isPasswordValid()) {
      this.error = 'La contraseña no cumple con todos los requisitos de seguridad';
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.success = 'Contraseña actualizada correctamente. Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Error al actualizar la contraseña';
      }
    });
  }
}
