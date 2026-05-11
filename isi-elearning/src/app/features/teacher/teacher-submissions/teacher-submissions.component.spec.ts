import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubmissionsComponent } from './teacher-submissions.component';

describe('TeacherSubmissionsComponent', () => {
  let component: TeacherSubmissionsComponent;
  let fixture: ComponentFixture<TeacherSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
