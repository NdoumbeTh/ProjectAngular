import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../courses/course.service';
import { ChapterService } from '../../../core/services/chapter.service';
import { ProgressService } from '../../../core/services/progress.service';
import { AssignmentService } from '../../../core/services/assignment.service';
import { QuizService } from '../quiz/quiz.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {

  course:any;
  chapters:any[] = [];

  progress:any = {
    total: 0,
    completed: 0,
    percent: 0,
    completedChapters: []
  };

  assignments:any[] = [];
  quiz:any;
  isEnrolled = false;
  hasQuiz = false;

  selectedFiles: { [key:number]: File } = {};
  mySubmissions:any[] = [];


  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private chapterService: ChapterService,
    private progressService: ProgressService,
    private assignmentService: AssignmentService,
    private quizService: QuizService
  ) {}

  ngOnInit(){
    const id = this.route.snapshot.params['id'];

    this.loadCourse(id);
    this.loadChapters(id);
    this.loadProgress(id);
    this.loadAssignments(id);
    this.loadQuiz(id);
    this.loadMySubmissions(id);


    this.courseService.checkEnrollment(id).subscribe((res:any)=>{
      this.isEnrolled = res.enrolled;
    });
  }
  loadMySubmissions(id:number){
  this.assignmentService.getMySubmissions(id)
    .subscribe(res => this.mySubmissions = res as any[]);
}


  // =========================
  // LOADERS
  // =========================

  loadCourse(id:number){
    this.courseService.getCourse(id).subscribe(res => this.course = res);
  }

  loadChapters(id:number){
    this.chapterService.getChapters(id).subscribe({
      next: (res:any) => {
        // 🔥 IMPORTANT: tri par position
        this.chapters = res.sort((a:any, b:any)=> a.position - b.position);
      },
      error: () => this.chapters = []
    });
  }

  loadProgress(id:number){
    this.progressService.getProgress(id).subscribe({
      next: (res:any) => this.progress = res,
      error: () => this.progress = { total:0, completed:0, percent:0, completedChapters:[] }
    });
  }

  loadAssignments(id:number){
    this.assignmentService.getAssignments(id).subscribe({
      next: (res:any) => this.assignments = res,
      error: () => this.assignments = []
    });
  }

  loadQuiz(id:number){
    this.quizService.getQuiz(id).subscribe({
      next: (res:any) => {
        this.quiz = res;
        this.hasQuiz = true;
      },
      error: () => this.hasQuiz = false
    });
  }

  // =========================
  // ACTIONS
  // =========================

  enroll(){
    this.courseService.enroll(this.course.id).subscribe(()=>{
      this.isEnrolled = true;
    });
  }

  markDone(chapterId: number) {
  this.progressService.markCompleted(chapterId).subscribe({
    next: (res: any) => {
      // Mise à jour locale immédiate sans rechargement
      this.progress.percent = res.percent;
      this.progress.completed = res.completed;
      this.progress.total = res.total;
      this.progress.completedChapters = res.completedChapters;
    },
    error: (err) => console.error('Erreur progression:', err)
  });
}

  // 🔓 déblocage
  isUnlocked(index:number): boolean {
    if(index === 0) return true;

    const prev = this.chapters[index - 1];

    return this.progress.completedChapters?.includes(prev.id);
  }

  // =========================
  // ASSIGNMENT
  // =========================

  onFileSelected(event:any, assignmentId:number){
    this.selectedFiles[assignmentId] = event.target.files[0];
  }

  submitAssignment(assignmentId:number){

    const file = this.selectedFiles[assignmentId];

    if(!file){
      alert("Choisir un fichier");
      return;
    }

    const formData = new FormData();
    formData.append('assignment_id', assignmentId.toString());
    formData.append('file', file);

    this.assignmentService.submit(formData).subscribe(()=>{
      alert("Devoir envoyé ✔");
    });

  }

}
