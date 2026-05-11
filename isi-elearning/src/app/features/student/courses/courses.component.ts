import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
templateUrl: './courses.component.html',
styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {

courses:any[] = [];

constructor(private courseService: CourseService){}

ngOnInit(){
this.loadCourses();
}

loadCourses(){
this.courseService.getCourses().subscribe((res:any)=>{
this.courses = res;
});
}

deleteCourse(id:number){
this.courseService.deleteCourse(id).subscribe(()=>{
this.loadCourses();
});
}
form = {
title: '',
description: '',
teacher_id: 1
};

createCourse(){

this.courseService.createCourse(this.form).subscribe(()=>{
this.loadCourses();
this.form = { title:'', description:'', teacher_id:1 };
});

}
enroll(course_id: number){

  this.courseService.enroll(course_id).subscribe({

    next: () => {
      alert("Inscription réussie ✔");
    },

    error: (err) => {
      alert(err.error.message || "Erreur inscription");
    }

  });

}
}
