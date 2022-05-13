import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {

  rechargeForm: FormGroup = new FormGroup({});
  user : any;

  submitted = false;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private authService: AuthenticationService
  ) {
    this.user = this.authService.userValue;
   }

  ngOnInit(): void {
    this.rechargeForm = this.formBuilder.group({
      cardId: ['', [Validators.required, Validators.min(100)]],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      byEmail: [this.user.username, [Validators.required, Validators.email]],
      updatedBy: [this.user.role.authority, Validators.required],
      fromEmail: [''],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.rechargeForm.controls; }

  onSubmit() {
    console.log("---recharging student account --->  : ", this.rechargeForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.rechargeForm.invalid) {
        return;
    }

    this.loading = true;

    this.studentService.recharge(this.rechargeForm.value)
    .pipe(first())
    .subscribe({
      next: (data: any) => {
        console.log("recharged student account successful! ", data);

         // default to login page
         this.router.navigateByUrl('/admin');
      },
      error: error => {
        console.error("Error while recharging student account! ", error);
        this.error = error;
        this.loading = false;
      }
    });
  }

}
