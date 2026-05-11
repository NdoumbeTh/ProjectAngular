import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../courses/course.service';
import { AssignmentService } from '../../../core/services/assignment.service';
import { ProgressService } from '../../../core/services/progress.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {

  user:any;
  courses:any[] = [];
  assignments:any[] = [];
  progress: number[] = [];
today = new Date();

get avgProgress(): number {
  if (!this.courses.length) return 0;
  const total = this.courses.reduce(
    (sum: number, c: any) => sum + (c.progress || 0), 0
  );
  return Math.round(total / this.courses.length);
}
  constructor(
    private courseService: CourseService,
    private assignmentService: AssignmentService,
    private progressService: ProgressService
  ){}

  ngOnInit(){

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.loadData();
    this.loadCourses();
    this.loadAssignments();

  }
  loadCourses() {
  this.courseService.getMyCourses().subscribe({
    next: (courses: any) => {
      this.courses = courses;
      // Charger la progression après les cours
      this.progressService.getAllProgress().subscribe({
  next: (progressData: any) => {
    // Sécuriser au cas où ce n'est pas un tableau
    const data = Array.isArray(progressData) ? progressData : [];
    data.forEach((p: any) => {
      const course = this.courses.find((c: any) => c.id === p.course_id);
      if (course) {
        course.progress = p.progress;
      }
    });
  },
  error: () => {}
});
    },
    error: () => this.courses = []
  });
}

loadAssignments() {
  this.assignmentService.getMySubmissions(this.user.id).subscribe({
    next: (assignments: any) => this.assignments = assignments,
    error: () => this.assignments = []
   });
}
  loadData(){

    // 📚 mes cours
    this.courseService.getMyCourses().subscribe((res:any)=>{
      this.courses = res;
    });

    // 📝 mes devoirs
    this.assignmentService.getMySubmissions(this.user.id).subscribe((res:any)=>{
      this.assignments = res;
    });

  }

}
