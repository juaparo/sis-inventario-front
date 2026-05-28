import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package, TrendingUp, TrendingDown, AlertTriangle, ShoppingCart, DollarSign, LucideAngularModule } from 'lucide-angular';
import { DashboardService, DashboardData } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  TrendingUpIcon = TrendingUp;
  TrendingDownIcon = TrendingDown;
  
  stats: any[] = [];
  lowStockProducts: any[] = [];
  recentMovements: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.lowStockProducts = data.lowStockProducts;
        this.recentMovements = data.recentMovements;
        
        // Mapear los datos numéricos a las tarjetas del UI
        this.stats = [
          {
            title: 'Total Productos',
            value: data.stats.totalProducts.toString(),
            change: '+0%',
            trend: 'up',
            icon: Package,
            color: 'blue'
          },
          {
            title: 'Productos Activos',
            value: data.stats.activeProducts.toString(),
            change: '+0%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'green'
          },
          {
            title: 'Valor Inventario',
            value: '$' + data.stats.inventoryValue.toLocaleString('es-CO'),
            change: '+0%',
            trend: 'up',
            icon: DollarSign,
            color: 'purple'
          },
          {
            title: 'Alertas Activas',
            value: data.stats.activeAlerts.toString(),
            change: '0',
            trend: 'down',
            icon: AlertTriangle,
            color: 'red'
          }
        ];
      },
      error: (err) => console.error('Error cargando el dashboard:', err)
    });
  }

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
