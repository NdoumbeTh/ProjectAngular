import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherQuizComponent } from './features/teacher/teacher-quiz/teacher-quiz.component';
import { TeacherAllSubmissionsComponent } from './features/teacher/teacher-all-submissions/teacher-all-submissions.component';
import { TeacherSubmissionsComponent } from './features/teacher/teacher-submissions/teacher-submissions.component';
import { CourseDetailsTeacherComponent } from './features/teacher/course-details-teacher/course-details-teacher.component';
import { TeacherChaptersComponent } from './features/teacher/teacher-chapters/teacher-chapters.component';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { ResultsComponent } from './features/student/results/results.component';
import { authGuard } from './core/guards/auth.guard';
import { CoursesComponent } from './features/student/courses/courses.component';
import { CourseDetailsComponent } from './features/student/course-details/course-details.component';
import { QuizComponent } from './features/student/quiz/quiz.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [


  { path: '', component: LoginComponent },


  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard('admin')]
  },

  {
    path: 'teacher',
    component: TeacherDashboardComponent,
    canActivate: [authGuard, roleGuard('teacher')]
  },
  {
  path: 'teacher/course/:id/chapters',
  component: TeacherChaptersComponent
},
{
  path: 'teacher/course/:id/quiz',
  component: TeacherQuizComponent
},
  {
  path: 'student/course/:id',
  component: CourseDetailsComponent,
  canActivate: [authGuard, roleGuard('student')]
},
{
  path: 'teacher/course/:id',
  component: CourseDetailsTeacherComponent,
  canActivate: [authGuard],
  data: { role: 'teacher' }
},
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [authGuard, roleGuard('student')]
  },

  {
    path: 'courses',
    component: CoursesComponent
  },


  {
    path: 'quiz/:id',
    component: QuizComponent,
    canActivate: [authGuard]
  },
  {
  path: 'teacher/assignment/:id/submissions',
  component: TeacherSubmissionsComponent,
  canActivate: [authGuard, roleGuard('teacher')]
},
{
  path: 'student/results',
  component: ResultsComponent,
  canActivate: [authGuard, roleGuard('student')]
},
{
  path: 'teacher/submissions',
  component: TeacherAllSubmissionsComponent,
  canActivate: [authGuard, roleGuard('teacher')]
},

  { path: '**', redirectTo: '' }

];
