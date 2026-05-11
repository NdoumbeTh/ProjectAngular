import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form = {
    email: '',
    password: ''
  };

  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

login(){

  this.auth.login(this.form).subscribe({

    next: (res:any) => {

      this.auth.saveToken(res.accessToken);
      this.auth.saveUser(res);

      // 🔥 REDIRECTION SELON RÔLE
      if(res.role === 'admin'){
        this.router.navigate(['/admin']);
      }

      else if(res.role === 'teacher'){
        this.router.navigate(['/teacher']);
      }

      else{
        this.router.navigate(['/student']);
      }

    },

    error: (err) => {
      this.error = err.error.message;
    }

  });

}

}
