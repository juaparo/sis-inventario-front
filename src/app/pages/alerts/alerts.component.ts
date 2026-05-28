import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertTriangle, Check, Clock, Package, LucideAngularModule } from 'lucide-angular';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  AlertTriangleIcon = AlertTriangle;
  CheckIcon = Check;
  ClockIcon = Clock;
  PackageIcon = Package;

  alerts: any[] = [];
  loading = false;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.loading = true;
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar alertas:', err);
        this.loading = false;
      }
    });
  }

  get unreadAlerts() {
    return this.alerts.filter(a => !a.leida);
  }

  get readAlerts() {
    return this.alerts.filter(a => a.leida);
  }

  get criticalAlertsCount() {
    return this.alerts.filter(a => this.isCritical(a)).length;
  }

  isCritical(alert: any): boolean {
    return alert.mensaje?.toLowerCase().includes('crítico');
  }

  markAsRead(alertId: string) {
    this.alertService.markAsRead(alertId).subscribe({
      next: () => {
        const alert = this.alerts.find(a => a._id === alertId);
        if (alert) alert.leida = true;
      },
      error: (err) => console.error('Error al marcar como leída:', err)
    });
  }

  markAllAsRead() {
    this.alertService.markAllAsRead().subscribe({
      next: () => this.alerts.forEach(a => a.leida = true),
      error: (err) => console.error('Error al marcar todas como leídas:', err)
    });
  }
}
