import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuizService {

  API = 'http://localhost:3000/api/quiz';

  constructor(private http: HttpClient) {}

  // 🔐 helper token
  getHeaders(){
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // =========================
  // 👨‍🏫 TEACHER
  // =========================

  createQuiz(data:any){
    return this.http.post(this.API, data, this.getHeaders());
  }

  getQuizByCourse(courseId:number){
    return this.http.get(
      `${this.API}/course/${courseId}`,
      this.getHeaders()
    );
  }

  deleteQuiz(id:number){
    return this.http.delete(
      `${this.API}/${id}`,
      this.getHeaders()
    );
  }

  // =========================
  // 🎓 STUDENT
  // =========================

getQuiz(courseId:number){
  return this.http.get<any>(
    `${this.API}/course/${courseId}`,
    this.getHeaders()
  );
}

  submitQuiz(data:any){
    return this.http.post<any>(
      `${this.API}/submit`,
      data,
      this.getHeaders()
    );
  }

}
