import { Component, OnInit } from '@angular/core';
import { ChapterService } from '../../../core/services/chapter.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-chapters.component.html',
  styleUrl: './teacher-chapters.component.css'
})
export class TeacherChaptersComponent implements OnInit {

  chapters:any[] = [];
  courseId!: number;

  form = {
    title: '',
    course_id: 0
  };

  selectedFile!: File;

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(){
    this.courseId = Number(this.route.snapshot.params['id']);
    this.form.course_id = this.courseId;
    this.loadChapters();
  }

  loadChapters(){
    this.chapterService.getChapters(this.courseId).subscribe((res:any)=>{
      this.chapters = res;
    });
  }

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  createChapter(){

    const formData = new FormData();

    formData.append('title', this.form.title);
    formData.append('course_id', this.courseId.toString());

    if(this.selectedFile){
      formData.append('video', this.selectedFile);
    }

    this.chapterService.create(formData).subscribe(()=>{
      this.loadChapters();
      this.form = { title:'', course_id:this.courseId };
    });

  }

  deleteChapter(id:number){
    this.chapterService.delete(id).subscribe(()=>{
      this.loadChapters();
    });
  }

}
