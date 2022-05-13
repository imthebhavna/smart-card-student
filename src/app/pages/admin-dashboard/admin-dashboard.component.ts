import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  adminPages: any = [];
  user: any;

  constructor(
    private router: Router,
    private authService: AuthenticationService
    ) { 
      this.user = this.authService.userValue;
    }

  ngOnInit(): void {

    this.adminPages = [
      { id: 1, page: '/add-student', title: 'add student', class: 'bi bi-plus-square' },
      { id: 2, page:  '/view-students', title: 'view all students', class: 'bi bi-list-ol'},
      { id: 3, page:  '/recharge', title: 'recharge students', class: 'bi bi-wallet2'}
    ];
  }

  redirectTo(redirectUrl: string) {
    this.router.navigate([redirectUrl]);
  }

}
