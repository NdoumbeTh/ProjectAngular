import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../core/services/assignment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-submissions.component.html',
  styleUrl: './teacher-submissions.component.css'
})
export class TeacherSubmissionsComponent implements OnInit {

  submissions:any[] = [];
  assignmentId!: number;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(){
    this.assignmentId = Number(this.route.snapshot.params['id']);
    this.loadSubmissions();
  }

  loadSubmissions(){
    this.assignmentService.getSubmissions(this.assignmentId)
      .subscribe((res:any)=>{
        this.submissions = res;
      });
  }

  grade(submission:any){
    this.assignmentService.grade(submission.id, {
      grade: submission.grade,
      feedback: submission.feedback
    }).subscribe(()=>{
      alert("Corrigé ✔");
    });
  }

}
