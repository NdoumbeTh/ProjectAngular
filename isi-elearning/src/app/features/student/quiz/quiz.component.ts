import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from './quiz.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {

  quiz: any;
  answers: any = {};
  score: number | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit() {
  const courseId = this.route.snapshot.params['id'];

  this.quizService.getQuiz(courseId).subscribe({
    next: (res: any) => {
      // getQuizByCourse retourne un tableau — prendre le premier
      if (Array.isArray(res) && res.length > 0) {
        this.quiz = res[0];
      } else if (!Array.isArray(res) && res) {
        this.quiz = res;
      } else {
        this.quiz = null;
      }
      this.loading = false;
    },
    error: (err) => {
      console.log(err);
      this.loading = false;
    }
  });
}

  selectAnswer(questionId: number, option: any) {
  // option est un objet { option_text, ... } ou une string selon le format
  this.answers[questionId] = typeof option === 'string' ? option : option.option_text;
}

  submitQuiz(){

    const payload = {
      quiz_id: this.quiz.id,
      answers: Object.keys(this.answers).map(qId => ({
        question_id: Number(qId),
        answer: this.answers[qId]
      }))
    };

    this.quizService.submitQuiz(payload).subscribe((res:any)=>{
      this.score = res.score;
    });

  }

}
