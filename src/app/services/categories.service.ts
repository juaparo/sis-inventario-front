import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/categories'; // Ajusta tu puerto del back

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(category: Omit<Category, 'id' | '_id' | 'productCount' | 'createdAt'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }
}