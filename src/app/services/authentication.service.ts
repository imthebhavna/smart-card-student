import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(
    private router: Router, 
    private http: HttpClient
    ) {
    let currentUser = localStorage.getItem('user');
    if((currentUser != null) || (currentUser != undefined)) {
      currentUser = JSON.parse(currentUser);
    }
    this.userSubject = new BehaviorSubject<any>(currentUser);
    this.user = this.userSubject.asObservable();
   }

  public get userValue(): any {
    console.log("getting user from authentication service ...");
    return this.userSubject.value;
  }

  get isAdmin(): boolean {
    return (this.userSubject.value != null) && (this.userSubject.value.role.authority === 'ROLE_ADMIN');
  }

  login(username: string, password: string) {
    // we have passed {observe: 'response'} in http options so that we can get complete response i.e. headers + body both
    return this.http.post<any>(`${environment.domain}/login`, { username, password }, {observe: 'response'})
        .pipe(map(response => {
            console.log('login response body: ' + response.body);
            let token = response.headers.get('Authorization');
            let currentUser = response.body;
            currentUser['token'] = token;
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(currentUser));
            this.userSubject.next(currentUser);
            return currentUser;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.user = this.userSubject.asObservable();
    this.router.navigate(['/login']);
  }
}
