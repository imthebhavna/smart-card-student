import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private roleToPage: any;

  private roles: any;
  private genders: any;

  constructor(private http: HttpClient) { 
    this.roleToPage = {
      ROLE_ADMIN : "/admin",
      ROLE_CANTEEN : "/payment",
      ROLE_LIBRARY : "/payment",
      ROLE_STATIONARY : "/payment",
      ROLE_FACULTY : "/faculty",
      ROLE_STUDENT : "/student" 
    };

    this.roles = [
      {key: 'Admin', value:'ROLE_ADMIN'},
      {key: 'Canteen', value:'ROLE_CANTEEN'},
      {key: 'Faculty', value:'ROLE_FACULTY'},
      {key: 'Library', value:'ROLE_LIBRARY'}, 
      {key: 'Stationary', value:'ROLE_STATIONARY'}
    ];

    this.genders = {
      "Male": "MALE",
      "Female": "FEMALE",
      "Other": "OTHER"
    };
  }

  register(user: any) {
    return this.http.post<any>(`${environment.domain}/register`, user);
  }

  // get home page url based on user's role 
  getRedirectUrl(role: string) {
    return this.roleToPage[role];
  }

  getRoles() {
    return this.roles;
  }

  getGenders() {
    return this.genders;
  }

}
