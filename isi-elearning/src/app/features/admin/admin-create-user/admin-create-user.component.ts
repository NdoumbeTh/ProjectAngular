import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-create-user',
  imports: [],
  templateUrl: './admin-create-user.component.html',
  styleUrl: './admin-create-user.component.css'
})
export class AdminCreateUserComponent {

  form = {
  name: '',
  email: '',
  password: '',
  role: 'student'
};

constructor(private http: HttpClient) {}

createUser(){

  this.http.post('http://localhost:3000/api/auth/admin/create-user', this.form)
    .subscribe(()=>{
      alert('Utilisateur créé ✔');
    });

}

}
