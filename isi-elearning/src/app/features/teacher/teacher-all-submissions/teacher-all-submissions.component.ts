import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AssignmentService } from '../../../core/services/assignment.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './teacher-all-submissions.component.html',
  styleUrl: './teacher-all-submissions.component.css'
})
export class TeacherAllSubmissionsComponent implements OnInit {

  submissions: any[] = [];
  loading = true;
  activeFilter: 'all' | 'pending' | 'graded' = 'pending';

  // Stocke les notes en cours de saisie
  gradeInputs: { [id: number]: { grade: number, feedback: string } } = {};

  constructor(private assignmentService: AssignmentService) {}

  ngOnInit() {
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.assignmentService.getTeacherSubmissions().subscribe({
      next: (data) => {
        this.submissions = data;
        // Initialiser les inputs pour chaque soumission
        data.forEach(s => {
          this.gradeInputs[s.id] = {
            grade: s.grade || 0,
            feedback: s.feedback || ''
          };
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get filtered(): any[] {
    if (this.activeFilter === 'pending')
      return this.submissions.filter(s => s.grade === null);
    if (this.activeFilter === 'graded')
      return this.submissions.filter(s => s.grade !== null);
    return this.submissions;
  }

  get pendingCount(): number {
    return this.submissions.filter(s => s.grade === null).length;
  }

  get gradedCount(): number {
    return this.submissions.filter(s => s.grade !== null).length;
  }

  grade(s: any) {
    const input = this.gradeInputs[s.id];
    if (input.grade < 0 || input.grade > 20) {
      alert('La note doit être entre 0 et 20');
      return;
    }
    this.assignmentService.gradeSubmission(s.id, input.grade, input.feedback)
      .subscribe({
        next: () => {
          s.grade = input.grade;
          s.feedback = input.feedback;
        },
        error: (err) => alert(err.error?.message || 'Erreur')
      });
  }
}
