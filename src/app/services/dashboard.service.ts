import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardData {
  stats: {
    totalProducts: number;
    activeProducts: number;
    inventoryValue: number;
    activeAlerts: number;
  };
  lowStockProducts: {
    name: string;
    category: string;
    stock: number;
    minStock: number;
  }[];
  recentMovements: {
    product: string;
    type: string;
    quantity: number;
    user: string;
    date: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }
}
