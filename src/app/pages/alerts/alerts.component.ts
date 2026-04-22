import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertTriangle, Check, Clock, Package, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  AlertTriangleIcon = AlertTriangle;
  CheckIcon = Check;
  ClockIcon = Clock;
  PackageIcon = Package;

  alerts: any[] = [
    { id: "1", product: "Laptop Dell XPS 15", message: "Stock crítico: 3 unidades disponibles (Mínimo: 10)", date: "2026-03-03 10:30", status: "unread", priority: "critical" },
    { id: "2", product: "Mouse Logitech MX Master", message: "Stock bajo: 5 unidades disponibles (Mínimo: 15)", date: "2026-03-03 09:15", status: "unread", priority: "warning" },
    { id: "3", product: "Teclado Mecánico RGB", message: "Stock crítico: 2 unidades disponibles (Mínimo: 8)", date: "2026-03-03 08:45", status: "unread", priority: "critical" },
    { id: "4", product: "Monitor LG 27 pulgadas", message: "Stock bajo: 4 unidades disponibles (Mínimo: 12)", date: "2026-03-02 16:20", status: "read", priority: "warning" },
    { id: "5", product: "Webcam HD 1080p", message: "Stock crítico: 1 unidad disponible (Mínimo: 10)", date: "2026-03-02 14:00", status: "read", priority: "critical" },
    { id: "6", product: "Auriculares Sony WH-1000XM5", message: "Stock bajo: 6 unidades disponibles (Mínimo: 10)", date: "2026-03-02 11:30", status: "read", priority: "warning" },
  ];

  get unreadAlerts() {
    return this.alerts.filter((alert) => alert.status === "unread");
  }

  get readAlerts() {
    return this.alerts.filter((alert) => alert.status === "read");
  }

  get criticalAlertsCount() {
    return this.alerts.filter((a) => a.priority === "critical").length;
  }

  markAsRead(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.status = "read";
  }

  markAllAsRead() {
    this.alerts.forEach(a => a.status = "read");
  }
}
