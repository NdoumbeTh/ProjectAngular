import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CourseService } from '../../student/courses/course.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {

  user:any;

  courses:any[] = [];
  today = new Date()

  // 🔥 formulaire création
  newCourse = {
    title: '',
    description: ''
  };

  stats = {
    courses: 0,
    students: 0,
    assignments: 0
  };

  loading = false;

  constructor(
    private courseService: CourseService
  ) {}

  ngOnInit(){

    this.user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    this.loadData();

  }

  // =========================
  // LOAD DATA
  // =========================

loadData(){

  this.loading = true;

  this.courseService.getCourses().subscribe({

    next: (res:any)=>{

      console.log('USER = ', this.user);
      console.log('COURSES = ', res);

      // 🔥 TEMPORAIRE :
      this.courses = res;

      this.stats.courses = this.courses.length;

      this.loading = false;

    },

    error:(err)=>{

      console.log(err);
      this.loading = false;

    }

  });

}
  // =========================
  // CREATE COURSE
  // =========================

  createCourse(){

    if(
      !this.newCourse.title ||
      !this.newCourse.description
    ){
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.courseService
      .createCourse(this.newCourse)
      .subscribe({

        next: ()=>{

          alert('Cours créé ✔');

          this.newCourse = {
            title: '',
            description: ''
          };

          this.loadData();

        },

        error: (err)=>{
          console.log(err);
        }

      });

  }

  // =========================
  // DELETE COURSE
  // =========================

  deleteCourse(id:number){

    const confirmDelete = confirm(
      'Supprimer ce cours ?'
    );

    if(!confirmDelete) return;

    this.courseService
      .deleteCourse(id)
      .subscribe({

        next: ()=>{

          this.loadData();

        },

        error: (err)=>{
          console.log(err);
        }

      });

  }

}
