import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl : './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignUpComponent implements OnInit, OnDestroy {
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

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.authService.createUser(email, password)
  }
}

