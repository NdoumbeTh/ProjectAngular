import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  user: any = null;
  role: string = '';

  adminNav: NavItem[] = [
    { label: 'Tableau de bord', icon: 'ti-layout-dashboard', route: '/admin' },
    { label: 'Utilisateurs',    icon: 'ti-users',             route: '/admin' },
    { label: 'Statistiques',    icon: 'ti-chart-bar',         route: '/admin' },
  ];

  teacherNav: NavItem[] = [
    { label: 'Tableau de bord', icon: 'ti-layout-dashboard', route: '/teacher'   },
    { label: 'Mes cours',       icon: 'ti-book',              route: '/teacher'   },
    { label: 'Devoirs',         icon: 'ti-clipboard-list',    route: '/teacher/course/id'   },
    { label: 'Quiz',            icon: 'ti-help-circle',       route: '/teacher/course/id'   },
    { label: 'Soumissions', icon: 'ti-inbox', route: '/teacher/submissions' },
  ];

  studentNav: NavItem[] = [
    { label: 'Tableau de bord', icon: 'ti-layout-dashboard', route: '/student'  },
    { label: ' Cours',       icon: 'ti-book',              route: '/courses'  },
    { label: 'Devoirs',         icon: 'ti-clipboard-list',    route: '/student'  },
    { label: 'Mes résultats', icon: 'ti-chart-bar', route: '/student/results' },
  ];

  get navItems(): NavItem[] {
    if (this.role === 'admin')   return this.adminNav;
    if (this.role === 'teacher') return this.teacherNav;
    if (this.role === 'student') return this.studentNav;
    return [];
  }

  get userInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get roleLabel(): string {
    if (this.role === 'admin')   return 'Administrateur';
    if (this.role === 'teacher') return 'Enseignant';
    if (this.role === 'student') return 'Étudiant';
    return '';
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.role = this.user?.role || '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
