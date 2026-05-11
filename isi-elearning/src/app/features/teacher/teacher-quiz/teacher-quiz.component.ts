import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../student/quiz/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-quiz.component.html',
  styleUrl: './teacher-quiz.component.css'
})
export class TeacherQuizComponent implements OnInit {

  courseId!: number;

  quizzes:any[] = [];

  quiz:any = {
    title: '',
    course_id: 0,
    questions: []
  };

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.quiz.course_id = this.courseId;

    this.loadQuizzes();
  }

  loadQuizzes() {
  this.quizService.getQuizByCourse(this.courseId).subscribe((res: any) => {
    this.quizzes = Array.isArray(res) ? res : (res ? [res] : []);
  });
}

  addQuestion(){
    this.quiz.questions.push({
      question: '',
      options: [
        { text:'', isCorrect:false },
        { text:'', isCorrect:false }
      ]
    });
  }

  addOption(q:any){
    q.options.push({ text:'', isCorrect:false });
  }

  setCorrect(q:any, index:number){
    q.options.forEach((opt:any, i:number)=>{
      opt.isCorrect = i === index;
    });
  }

  createQuiz(){

    this.quizService.createQuiz(this.quiz).subscribe(()=>{

      alert("Quiz créé ✔");

      this.quiz = {
        title: '',
        course_id: this.courseId,
        questions: []
      };

      this.loadQuizzes();

    });

  }

  deleteQuiz(id:number){
    this.quizService.deleteQuiz(id).subscribe(()=>{
      this.loadQuizzes();
    });
  }

}
