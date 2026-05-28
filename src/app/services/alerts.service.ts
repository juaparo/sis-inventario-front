import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private apiUrl = `${environment.apiUrl}/alerts`;
  
  // Observable global para el conteo de no leídas
  public unreadCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(alerts => {
        const unread = alerts.filter(a => !a.read).length;
        this.unreadCount$.next(unread);
      })
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.unreadCount$.value;
        if (current > 0) {
          this.unreadCount$.next(current - 1);
        }
      })
    );
  }
}
