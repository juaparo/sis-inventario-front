import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package, TrendingUp, TrendingDown, AlertTriangle, ShoppingCart, DollarSign, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  TrendingUpIcon = TrendingUp;
  TrendingDownIcon = TrendingDown;
  
  stats = [
    {
      title: 'Total Productos',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Productos Activos',
      value: '235',
      change: '+8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Valor Inventario',
      value: '$125,450',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Alertas Activas',
      value: '12',
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  lowStockProducts = [
    { name: 'Laptop Dell XPS 15', stock: 3, minStock: 10, category: 'Electrónica' },
    { name: 'Mouse Logitech MX Master', stock: 5, minStock: 15, category: 'Accesorios' },
    { name: 'Teclado Mecánico RGB', stock: 2, minStock: 8, category: 'Accesorios' },
    { name: 'Monitor LG 27 pulgadas', stock: 4, minStock: 12, category: 'Electrónica' },
    { name: 'Webcam HD 1080p', stock: 1, minStock: 10, category: 'Accesorios' }
  ];

  recentMovements = [
    { product: 'iPhone 14 Pro', type: 'Entrada', quantity: 50, user: 'Juan Pérez', date: 'Hace 2 horas' },
    { product: 'MacBook Pro M3', type: 'Salida', quantity: 15, user: 'María García', date: 'Hace 3 horas' },
    { product: 'iPad Air', type: 'Entrada', quantity: 30, user: 'Juan Pérez', date: 'Hace 5 horas' },
    { product: 'AirPods Pro', type: 'Salida', quantity: 25, user: 'Carlos López', date: 'Hace 1 día' },
    { product: 'Apple Watch', type: 'Entrada', quantity: 40, user: 'Juan Pérez', date: 'Hace 1 día' }
  ];

  getColorClasses(color: string): string {
    const classes: any = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600'
    };
    return classes[color];
  }
}
