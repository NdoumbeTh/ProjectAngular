import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CourseService } from '../../student/courses/course.service';
import { ChapterService } from '../../../core/services/chapter.service';
import { QuizService } from '../../student/quiz/quiz.service';
import { AssignmentService } from '../../../core/services/assignment.service';

@Component({
  selector: 'app-course-details-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-details-teacher.component.html',
  styleUrl: './course-details-teacher.component.css'
})
export class CourseDetailsTeacherComponent implements OnInit {

  courseId!: number;

  course: any;

  chapters: any[] = [];

  assignments: any[] = [];

  quiz: any = null;

  hasQuiz = false;

  tab = 'chapters';

  selectedVideo!: File;

  selectedAssignmentFile!: File;

  newChapter = {
    title: ''
  };

  newAssignment = {
    title: '',
    description: '',
    due_date: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private chapterService: ChapterService,
    private quizService: QuizService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {

    this.courseId = Number(this.route.snapshot.params['id']);

    this.loadCourse();

    this.loadChapters();

    this.loadQuiz();

    this.loadAssignments();
  }

  // =========================
  // COURSE
  // =========================

  loadCourse() {

    this.courseService.getCourse(this.courseId).subscribe((res:any) => {
      this.course = res;
    });

  }

  // =========================
  // CHAPTERS
  // =========================

  loadChapters() {

    this.chapterService.getChapters(this.courseId).subscribe((res:any) => {
      this.chapters = res;
    });

  }

  onVideoSelected(event:any) {
    this.selectedVideo = event.target.files[0];
  }

  addChapter() {

    const formData = new FormData();

    formData.append('title', this.newChapter.title);
    formData.append('course_id', this.courseId.toString());

    if(this.selectedVideo){
      formData.append('video', this.selectedVideo);
    }

    this.chapterService.create(formData).subscribe(() => {

      this.newChapter.title = '';

      this.loadChapters();

    });

  }

  deleteChapter(id:number) {

    this.chapterService.delete(id).subscribe(() => {
      this.loadChapters();
    });

  }

  // =========================
  // QUIZ
  // =========================

loadQuiz(){

  this.quizService
    .getQuizByCourse(this.courseId)
    .subscribe({

      next:(res:any)=>{

        console.log('QUIZ =>', res);

        if(res){

          this.quiz = res;

          // 🔥 sécurité
          if(!Array.isArray(this.quiz.questions)){
            this.quiz.questions = [];
          }

          this.hasQuiz = true;

        }else{

          this.quiz = null;
          this.hasQuiz = false;

        }

      },

      error:(err)=>{

        console.log(err);

        this.quiz = null;
        this.hasQuiz = false;

      }

    });

}
  deleteQuiz() {

    if(this.quiz && this.quiz.id){
      this.quizService.deleteQuiz(this.quiz.id)
        .subscribe(() => {
          this.loadQuiz();
        });
    }

  }

  // =========================
  // ASSIGNMENTS
  // =========================

  loadAssignments() {

    this.assignmentService.getAssignments(this.courseId)
      .subscribe((res:any) => {

        this.assignments = res;

      });

  }

  onAssignmentFileSelected(event:any) {

    this.selectedAssignmentFile = event.target.files[0];

  }

  addAssignment() {

    const formData = new FormData();

    formData.append('title', this.newAssignment.title);
    formData.append('description', this.newAssignment.description);
    formData.append('due_date', this.newAssignment.due_date);
    formData.append('course_id', this.courseId.toString());

    if(this.selectedAssignmentFile){
      formData.append('file', this.selectedAssignmentFile);
    }

    this.assignmentService.create(formData)
      .subscribe(() => {

        this.newAssignment = {
          title: '',
          description: '',
          due_date: ''
        };

        this.loadAssignments();

      });

  }

  viewSubmissions(id:number){

    this.router.navigate(['/teacher/assignment', id, 'submissions']);

  }

}
