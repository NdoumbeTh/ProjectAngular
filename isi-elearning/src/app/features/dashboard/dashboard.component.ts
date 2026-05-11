import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../student/courses/course.service';
import { AssignmentService } from '../../core/services/assignment.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

user:any;
courses:any[] = [];
assignments:any[] = [];
progress:any;

constructor(
  private assignmentService: AssignmentService,
  private progressService: ProgressService,
  private courseService: CourseService
){}

ngOnInit(){

this.user = JSON.parse(localStorage.getItem('user') || '{}');

if(this.user.role === 'student'){
  this.loadStudentData();
}

if(this.user.role === 'teacher'){
  this.loadTeacherData();
}

if(this.user.role === 'admin'){
  this.loadAdminData();
}

}

loadStudentData(){

this.courseService.getMyCourses().subscribe((res:any)=>{
  this.courses = res;
});

this.assignmentService.getMySubmissions().subscribe((res:any)=>{
  this.assignments = res;
});

}

loadTeacherData(){
this.courseService.getCourses().subscribe((res:any)=>{
  this.courses = res;
});
}

loadAdminData(){
this.courseService.getCourses().subscribe((res:any)=>{
  this.courses = res;
});
}

}
