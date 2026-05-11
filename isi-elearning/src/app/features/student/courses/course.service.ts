import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  API = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) {}

  // 🔥 headers JWT
  getHeaders(){

    const token = localStorage.getItem('token');

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

  }

  // ======================
  // COURSES
  // ======================

  getCourses(){
    return this.http.get(
      this.API,
      this.getHeaders()
    );
  }

  getCourse(id:number){
    return this.http.get(
      `${this.API}/${id}`,
      this.getHeaders()
    );
  }

  createCourse(data:any){
    return this.http.post(
      this.API,
      data,
      this.getHeaders()
    );
  }

  deleteCourse(id:number){
    return this.http.delete(
      `${this.API}/${id}`,
      this.getHeaders()
    );
  }

  // ======================
  // ENROLLMENTS
  // ======================

  enroll(course_id:number){
    return this.http.post(
      'http://localhost:3000/api/enrollments',
      { course_id },
      this.getHeaders()
    );
  }

  getMyCourses(){
    return this.http.get(
      'http://localhost:3000/api/enrollments/student',
      this.getHeaders()
    );
  }

  checkEnrollment(courseId:number){
    return this.http.get(
      `http://localhost:3000/api/enrollments/check/${courseId}`,
      this.getHeaders()
    );
  }

}
