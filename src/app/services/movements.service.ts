import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  private apiUrl = `${environment.apiUrl}/movements`;

  constructor(private http: HttpClient) {}

  getMovements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createMovement(movement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movement);
  }
}
