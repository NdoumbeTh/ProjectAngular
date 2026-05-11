import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  API = 'http://localhost:3000/api/chapters';

  constructor(private http: HttpClient) {}

  getChapters(courseId:number){
    return this.http.get(`${this.API}/course/${courseId}`);
  }

  create(data:any){
    return this.http.post(this.API, data);
  }

  delete(id:number){
    return this.http.delete(`${this.API}/${id}`);
  }

}
