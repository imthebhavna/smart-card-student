import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  studentForm: FormGroup = new FormGroup({});
  configs: any;

  submitted = false;
  loading = false;
  error = '';

  private lettersOnly: string = "^[A-Za-z]+$";
  private numbersOnly: string = "^[0-9]+$";
  private mobileOnly: string = "^(\\+91)*[6-9][0-9]{9}$";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersOnly)]],
      middleName: ['', Validators.minLength(3)],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersOnly)]],
      cardId: ['', [Validators.required, Validators.min(100)]],
      rollNo: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['+91', [Validators.required, Validators.pattern(this.mobileOnly)]],
      role: ['', Validators.required],
      gender: ['', Validators.required],
      course: ['', Validators.required],
      branch: ['', Validators.required],
    });

    this.configs = this.studentService.getAllConfigurations()
    .subscribe({
       next: (configurations: any) => {
         console.log("student service: setting student configurations");
         this.configs=configurations;
      },
       error: () => {
         console.log("Error while getting student configurations!");
      }
      });
    console.log("student configurations: ", this.configs);
  }

  // convenience getter for easy access to form fields
  get f() { return this.studentForm.controls; }

  onSubmit() {
    console.log("---add student---  : ", this.studentForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.studentForm.invalid) {
        return;
    }

    this.loading = true;

    this.studentService.add(this.studentForm.value)
    .pipe(first())
    .subscribe({
      next: (data: any) => {
        console.log("added student successful! ", data);

         // default to login page
         this.router.navigateByUrl('/admin');
      },
      error: error => {
        console.error("Error while adding student! ", error);
        this.error = error;
        this.loading = false;
      }
    });
  }

}
