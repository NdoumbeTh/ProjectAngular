import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAllSubmissionsComponent } from './teacher-all-submissions.component';

describe('TeacherAllSubmissionsComponent', () => {
  let component: TeacherAllSubmissionsComponent;
  let fixture: ComponentFixture<TeacherAllSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAllSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAllSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
