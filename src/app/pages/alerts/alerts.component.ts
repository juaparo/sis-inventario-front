import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertTriangle, Check, Clock, Package, LucideAngularModule } from 'lucide-angular';
import { AlertsService } from '../../services/alerts.service';

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

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.alertsService.getAlerts().subscribe({
      next: (data) => this.alerts = data,
      error: (err) => console.error('Error loading alerts', err)
    });
  }

  get unreadAlerts() {
    return this.alerts.filter((alert) => !alert.read);
  }

  get readAlerts() {
    return this.alerts.filter((alert) => alert.read);
  }

  get criticalAlertsCount() {
    return this.alerts.filter((a) => a.level === "OUT_OF_STOCK").length;
  }

  markAsRead(alertId: string) {
    this.alertsService.markAsRead(alertId).subscribe({
      next: () => {
        const alert = this.alerts.find(a => a._id === alertId);
        if (alert) alert.read = true;
      },
      error: (err) => console.error('Error marking alert as read', err)
    });
  }

  markAllAsRead() {
    this.unreadAlerts.forEach(a => {
      this.markAsRead(a._id);
    });
  }
}
