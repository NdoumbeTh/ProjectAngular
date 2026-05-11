import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  form = {
    name: '',
    email: '',
    password: '',
    role: 'student'
  };

  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  register(){

    this.error = '';
    this.success = '';

    this.auth.register(this.form).subscribe({

      next: () => {

        this.success = "Inscription réussie ✔";

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);

      },

      error: (err) => {
        this.error = err.error.message || "Erreur inscription";
      }

    });

  }

}
