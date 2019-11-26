import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl : './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSub: Subscription;
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
      this.isLoading = false;
    });
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
   if (form.invalid) {
      return;
    }
   this.isLoading = true;
   const email = form.value.email;
   const password = form.value.password;
   this.authService.login(email, password);
  }
}

