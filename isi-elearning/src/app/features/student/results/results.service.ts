import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ResultsService {

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  getMyResults() {
    return this.http.get<any>(
      'http://localhost:3000/api/quiz/my-results',
      this.getHeaders()
    );
  }
}