import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',

})
export class AdminService {

  constructor(private http: HttpClient) { }
getEnrollmentStats(){
  const token = localStorage.getItem('token');

  return this.http.get<any[]>('http://localhost:3000/api/admin/enrollments-stats', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

getEnrollmentsByCourse() {
  const token = localStorage.getItem('token');
  return this.http.get<any[]>('http://localhost:3000/api/admin/enrollments-by-course', {
    headers: { Authorization: `Bearer ${token}` }
  });
}
}
