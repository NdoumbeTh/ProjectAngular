import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { AdminService } from '../admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  user: any;
  users: any[] = [];
  barChart: any;
  doughnutChart: any;

  stats = { users: 0, courses: 0, enrollments: 0 };
  form = { name: '', email: '', password: '', role: 'student' };

  @ViewChild('barCanvas')      barCanvas!: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;

  constructor(
    private http: HttpClient,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadStats();
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.loadBarChart();
    this.loadDoughnutChart();
  }

  loadStats() {
    this.http.get('http://localhost:3000/api/admin/stats')
      .subscribe(res => this.stats = res as any);
  }

  loadUsers() {
    this.http.get('http://localhost:3000/api/admin/users')
      .subscribe((res: any) => {
        this.users = res;
        // Refresh doughnut quand users chargés
        if (this.doughnutChart) {
          this.doughnutChart.data.datasets[0].data = [
            this.studentCount, this.teacherCount, this.adminCount
          ];
          this.doughnutChart.update();
        }
      });
  }

  createUser() {
    this.http.post('http://localhost:3000/api/auth/admin/create-user', this.form)
      .subscribe({
        next: () => {
          alert('Utilisateur créé ✔');
          this.loadUsers();
          this.form = { name: '', email: '', password: '', role: 'student' };
        },
        error: (err) => alert(err.error?.message || 'Erreur création')
      });
  }

  deleteUser(id: number) {
    this.http.delete(`http://localhost:3000/api/admin/users/${id}`)
      .subscribe(() => this.loadUsers());
  }

  loadBarChart() {
    this.adminService.getEnrollmentsByCourse().subscribe((data: any[]) => {
      if (this.barChart) this.barChart.destroy();

      const labels = data.map(d => d.title.length > 18 ? d.title.slice(0, 18) + '…' : d.title);
      const values = data.map(d => d.total);

      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Inscriptions',
            data: values,
            backgroundColor: [
              'rgba(108, 71, 255, 0.85)',
              'rgba(108, 71, 255, 0.70)',
              'rgba(108, 71, 255, 0.58)',
              'rgba(108, 71, 255, 0.46)',
              'rgba(108, 71, 255, 0.34)',
              'rgba(108, 71, 255, 0.22)',
            ],
            borderColor: '#6c47ff',
            borderWidth: 1.5,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1047',
              titleColor: 'white',
              bodyColor: 'rgba(255,255,255,0.7)',
              padding: 10,
              cornerRadius: 8
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#aaa', font: { size: 11 } }
            },
            y: {
              grid: { color: '#f0eeff' },
              ticks: { color: '#aaa', font: { size: 11 }, stepSize: 1 },
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  loadDoughnutChart() {
    if (this.doughnutChart) this.doughnutChart.destroy();

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Étudiants', 'Enseignants', 'Admins'],
        datasets: [{
          data: [this.studentCount, this.teacherCount, this.adminCount],
          backgroundColor: ['#0369a1', '#6c47ff', '#ea580c'],
          borderColor: 'white',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1047',
            titleColor: 'white',
            bodyColor: 'rgba(255,255,255,0.7)',
            padding: 10,
            cornerRadius: 8
          }
        }
      }
    });
  }

  get studentCount() { return this.users.filter(u => u.role === 'student').length; }
  get teacherCount() { return this.users.filter(u => u.role === 'teacher').length; }
  get adminCount()   { return this.users.filter(u => u.role === 'admin').length; }
}