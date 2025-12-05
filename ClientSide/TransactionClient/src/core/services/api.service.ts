// src/app/core/services/api.service.ts
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  rootUrl: string;
  private readonly defaultHeaders: HttpHeaders;

  private loadingState = signal<{ [key: string]: boolean }>({});
  public isLoading = computed(() => Object.values(this.loadingState()).some(state => state));

  constructor(private http: HttpClient) {
    this.rootUrl = 'api';
    this.defaultHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    endpoint: string,
    options: {
      body?: any,
      params?: HttpParams,
      customRootUrl?: string,
      responseType?: 'json' | 'text' | 'blob'
    } = {}
  ): Observable<T> {
    const url = options.customRootUrl
      ? `${options.customRootUrl}${endpoint}`
      : `${this.rootUrl}/${endpoint}`;

    const requestOptions = {
      body: options.body,
      headers: this.defaultHeaders,
      params: options.params,
      observe: 'body' as const,
      responseType: (options.responseType || 'json') as 'json'
    };

    const loadingKey = `${method}-${endpoint}`;
    this.loadingState.update(state => ({ ...state, [loadingKey]: true }));

    return this.http.request<T>(method, url, requestOptions).pipe(
      retry(1),
      catchError(this.handleError),
      map(response => {
        this.loadingState.update(state => ({ ...state, [loadingKey]: false }));
        return response as T;
      })
    );
  }

  getList<T>(endpoint: string): Observable<T[]> {
    return this.request<T[]>('GET', endpoint);
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.request<T>('GET', `${endpoint}/${id}`);
  }

  getInfo<T>(endpoint: string): Observable<T> {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, content: any, customRootUrl?: string): Observable<T> {
    return this.request<T>('POST', endpoint, {
      body: content,
      customRootUrl
    });
  }

  UpdateDB<T>(url: string, content: any): Observable<T> {
    return this.http.post<T>(`${this.rootUrl}/${url}`, content);
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    const params = new HttpParams().set('id', id.toString());
    return this.request<T>('DELETE', endpoint, { params });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
