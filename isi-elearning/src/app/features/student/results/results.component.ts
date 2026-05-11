import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResultsService } from './results.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {

  quizResults: any[] = [];
  assignmentResults: any[] = [];
  loading = true;
  activeTab: 'all' | 'quiz' | 'assignments' = 'all';

  constructor(private resultsService: ResultsService) {}

  ngOnInit() {
    this.resultsService.getMyResults().subscribe({
      next: (data) => {
        this.quizResults = data.quiz;
        this.assignmentResults = data.assignments;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  get avgQuizScore(): number {
    if (!this.quizResults.length) return 0;
    const total = this.quizResults.reduce((sum, r) =>
      sum + Math.round((r.score / r.total) * 100), 0);
    return Math.round(total / this.quizResults.length);
  }

  get avgAssignmentGrade(): number {
    const graded = this.assignmentResults.filter(r => r.grade !== null);
    if (!graded.length) return 0;
    return Math.round(graded.reduce((sum, r) => sum + r.grade, 0) / graded.length);
  }

  get allResults(): any[] {
    const quiz = this.quizResults.map(r => ({ ...r, type: 'quiz' }));
    const assignments = this.assignmentResults.map(r => ({ ...r, type: 'assignment' }));
    return [...quiz, ...assignments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  get displayedResults(): any[] {
    if (this.activeTab === 'quiz') return this.quizResults.map(r => ({ ...r, type: 'quiz' }));
    if (this.activeTab === 'assignments') return this.assignmentResults.map(r => ({ ...r, type: 'assignment' }));
    return this.allResults;
  }

  scorePercent(r: any): number {
    return Math.round((r.score / r.total) * 100);
  }

  scoreColor(percent: number): string {
    if (percent >= 80) return 'green';
    if (percent >= 50) return 'orange';
    return 'red';
  }

  gradeColor(grade: number): string {
    if (grade >= 16) return 'green';
    if (grade >= 10) return 'orange';
    return 'red';
  }
}