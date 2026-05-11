import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssignmentService {

constructor(private http: HttpClient) {}

API = 'http://localhost:3000/api/assignments';

getAssignments(courseId:number){
  return this.http.get(`${this.API}/course/${courseId}`);
}

create(data:any){
  return this.http.post(this.API, data);
}
getTeacherSubmissions() {
  const token = localStorage.getItem('token');
  return this.http.get<any[]>(
    'http://localhost:3000/api/assignments/teacher/all-submissions',
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

gradeSubmission(id: number, grade: number, feedback: string) {
  const token = localStorage.getItem('token');
  return this.http.put<any>(
    `http://localhost:3000/api/assignments/submissions/${id}/grade`,
    { grade, feedback },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
submit(data:any){
  return this.http.post(`${this.API}/submit`, data);
}

getSubmissions(id:number){
  return this.http.get(`${this.API}/submissions/${id}`);
}

grade(id:number, data:any){
  return this.http.put(`${this.API}/grade/${id}`, data);
}


getMySubmissions(courseId:number){
  return this.http.get(`${this.API}/my/${courseId}`);
}

}
