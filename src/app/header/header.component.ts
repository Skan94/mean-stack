import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector : 'app-header',
  templateUrl : '../header/header.component.html',
  styleUrls : ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  private authSub: Subscription;
  userIsAuthenticated = false;
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
  }
}
