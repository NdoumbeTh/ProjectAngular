import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProgressService {

  private API = 'http://localhost:3000/api/progress';

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  // Marquer un chapitre comme terminé
  markCompleted(chapterId: number) {
    return this.http.post<any>(
      `${this.API}/mark`,
      { chapter_id: chapterId },
      this.headers()
    );
  }

  // Progression pour un cours
  getProgress(courseId: number) {
    return this.http.get<any>(
      `${this.API}/course/${courseId}`,
      this.headers()
    );
  }

  // Toutes les progressions (dashboard)
  getAllProgress() {
    return this.http.get<any[]>(
      `${this.API}/all`,
      this.headers()
    );
  }
}