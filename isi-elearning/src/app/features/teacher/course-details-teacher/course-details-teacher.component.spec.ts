import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsTeacherComponent } from './course-details-teacher.component';

describe('CourseDetailsTeacherComponent', () => {
  let component: CourseDetailsTeacherComponent;
  let fixture: ComponentFixture<CourseDetailsTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailsTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDetailsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
