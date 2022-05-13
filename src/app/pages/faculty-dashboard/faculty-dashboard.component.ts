import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FacultyService } from 'src/app/services/faculty.service';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit {

  faculty: any;
  facultyPages: any = [];
  user: any;

  configs : any;
  submitted = false;
  loading = false;
  error = '';

  subjectForm: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private facultyService: FacultyService
    ) { 
      this.user = this.authService.userValue;

      this.facultyService.getByEmailOrFacultyId(this.user.username).subscribe({
        next: (data: any) => {
          this.faculty = data;
          console.log("-- faculty data -- ", this.faculty);
          this.loadFaultyPages();
        },
        error: error => {
          this,error = error;
          console.error("Error while getting faculty by id or email! ", error);
        }
      });
    }

  ngOnInit(): void {
    this.getConfigs();

    this.subjectForm = this.formBuilder.group({
      subject: ['', Validators.required]
    });

  }

  loadFaultyPages(): void {
    this.facultyPages = [
      { id: 1, page:  '/view-students', title: 'view all students', class: 'bi bi-list-ol'},
      { id: 2, page:  '/card-attendance/'+this.faculty.id, title: 'mark attendance by card', class: 'bi bi-wallet2'}
    ];
  }

  redirectTo(redirectUrl: string) {
    this.router.navigate([redirectUrl]);
  }

  getConfigs() {
    this.facultyService.getAttendanceConfigs().subscribe({
      next: (data: any) => {
        this.configs = data;
        console.log("-- attendance configs -- ", this.configs);
      },
      error: error => {
        this.error = error;
        console.error("Error while getting attendance configurations ! ", error);
      }
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.subjectForm.controls; }

  onSubmit() {
    console.log("---selected subject---  : ", this.subjectForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.subjectForm.invalid) {
        return;
    }

    this.loading = true;

    this.router.navigate(['/card-attendance/'+this.faculty.id + '/' + this.subjectForm.controls['subject'].value]);
  }

}
