import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  submitted = false;
  loading = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService : UserService,
    private studentService: StudentService
  ) {
    // redirect to home if already logged in
    let user = this.authenticationService.userValue; 
    if(user) {
      this.redirectTo(user);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  // get return url from query parameters or default to home page
  redirectTo(user: any): void {
    const role = user?.role?.authority;
    let returnUrl = this.userService.getRedirectUrl(role);

    if(role != 'ROLE_STUDENT') {
      console.log("redirecting to home page: " + returnUrl);
      this.router.navigateByUrl(returnUrl);
    } else {
      this.studentService.getByCardIdOrEmail(user.username)
        .subscribe({
          next: (student) => {
            returnUrl = returnUrl + "/" + student.cardId;
            console.log("redirecting to home page: " + returnUrl);
            this.router.navigateByUrl(returnUrl);
          }
        });
    }
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
            next: (user: any) => {
                this.redirectTo(user);
            },
            error: error => {
                this.error = error;
                this.loading = false;
            }
        });
  }
}
