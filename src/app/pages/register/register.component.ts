import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});

  submitted = false;
  loading = false;
  error = '';

  roles: any = [];
  genders: any = {};

  private lettersOnly: string = "^[A-Za-z]+$";
  private mobileOnly: string = "^(\\+91)*[6-9][0-9]{9}$";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { 
    // redirect to home if already logged in 
    if(this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      profile: this.formBuilder.group({
        firstName: [''],
        middleName: [''],
        lastName: [''],
        mobile: [''],
        gender: [null]
      })
    });

    this.roles = this.userService.getRoles();
    this.genders = this.userService.getGenders();

    this.updateProfileValidation();
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  get p() { return (this.registerForm.get('profile') as FormGroup).controls; }

  /** needed in case of faculty */
  updateProfileValidation() {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      if(role == 'ROLE_FACULTY') {
        let profileFormGroup = (this.registerForm.get('profile') as FormGroup);

        profileFormGroup.controls['gender'].setValidators([Validators.required]);
        profileFormGroup.controls['gender'].updateValueAndValidity();

        profileFormGroup.controls['mobile'].setValue('+91');
        profileFormGroup.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.mobileOnly)]);
        profileFormGroup.controls['mobile'].updateValueAndValidity();

        profileFormGroup.controls['firstName'].setValidators([Validators.required, Validators.minLength(3), Validators.pattern(this.lettersOnly)]);
        profileFormGroup.controls['firstName'].updateValueAndValidity();

        profileFormGroup.controls['middleName'].setValidators([Validators.minLength(3)]);
        profileFormGroup.controls['middleName'].updateValueAndValidity();

        profileFormGroup.controls['lastName'].setValidators([Validators.required, Validators.minLength(3), Validators.pattern(this.lettersOnly)]);
        profileFormGroup.controls['lastName'].updateValueAndValidity();
      }
    })
  }


  onSubmit() {
    console.log("---register---  : ", this.registerForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;
    
    this.userService.register(this.registerForm.value)
    .pipe(first())
    .subscribe({
      next: (data: any) => {
        console.log("registration successful! ", data);

         // default to login page
         this.router.navigateByUrl('/login');
      },
      error: error => {
        console.error("Error while registering user! ", error);
        this.error = error;
        this.loading = false;
      }
    });

  }


}