import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData} from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({providedIn : 'root'})

export class AuthService {
  constructor(private httpClient: HttpClient,private router: Router) { }
  private token: string;
  private isAuthenticated = false;
  private authServiceListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authServiceListener.asObservable();
  }
  createUser(email: string, password: string) {
    const authData: AuthData = {email : email, password: password}
    this.httpClient.post(BACKEND_URL + 'signup', authData).subscribe( () => {
      this.router.navigate(['/']);
    }, error => {
      this.authServiceListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email : email, password : password};
    this.httpClient.post<{token: string, expiresIn: number,userId: string}>
    (BACKEND_URL + 'login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authServiceListener.next(true);
        const now = new Date();
        const expiration = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expiration, this.userId);
        this.router.navigate(['/']);
      }
     },error => {
      this.authServiceListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    if (!authInformation) {
      return;
    }
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authServiceListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authServiceListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
    this.clearAuthData();
  }

  getUserId() {
    return this.userId;
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId',userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expiration),
      userId: userId
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
