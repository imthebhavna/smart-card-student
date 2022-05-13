import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-payment-dashboard',
  templateUrl: './payment-dashboard.component.html',
  styleUrls: ['./payment-dashboard.component.css']
})
export class PaymentDashboardComponent implements OnInit {

  paymentForm: FormGroup = new FormGroup({});
  user : any;

  submitted = false;
  loading = false;
  error = '';

  paymentMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private authService: AuthenticationService
  ) { 
    this.user = this.authService.userValue;
    this.paymentMessage = null;
  }

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      cardId: ['', [Validators.required, Validators.min(100)]],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      byEmail: [this.user.username, [Validators.required, Validators.email]],
      updatedBy: [this.user.role.authority, Validators.required],
      fromEmail: [''],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.paymentForm.controls; }

  onSubmit() {
    console.log("---deducing money from student account --->  : ", this.paymentForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.paymentForm.invalid) {
        return;
    }

    this.loading = true;

    this.studentService.pay(this.paymentForm.value)
    .pipe(first())
    .subscribe({
      next: (data: any) => {
        console.log("student payment account successful! ", data);
          this.paymentMessage = `Paid ${this.paymentForm.value.amount} successfully`;
         // refresh page
         window.location.reload();
      },
      error: error => {
        console.error("Error while deducting from student account! ", error);
        this.error = error;
        this.loading = false;
      }
    });
  }

}
