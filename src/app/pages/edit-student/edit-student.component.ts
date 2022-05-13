import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  studentForm: FormGroup = new FormGroup({});
  cardId: string = '';
  student: any;

  configs: any;

  submitted = false;
  loading = false;
  error = '';

  private lettersOnly: string = "^[A-Za-z]+$";
  private numbersOnly: string = "^[0-9]+$";
  private mobileOnly: string = "^(\\+91)*[6-9][0-9]{9}$";

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {
    this.loadEmptyForm();
    this.cardId = this.activatedRoute.snapshot.params['cardId'];
    console.log("got card ID: " + this.cardId);
    this.getStudent();
    
   }

  ngOnInit(): void {
    this.getConfigurations();
  }

  loadEmptyForm(): void {
    this.studentForm = this.formBuilder.group({
      id: [''],
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
  }

  // convenience getter for easy access to form fields
  get f() { return this.studentForm.controls; }

  getConfigurations(): void {
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
  }

  getStudent(): void {
    this.studentService.getByCardIdOrEmail(this.cardId)
      .subscribe({
        next: (student: any) => {
          this.student = student;
          console.log("got student by card Id, student: ", this.student);
          this.populateForm();
        },
        error: error => {
          console.error(`Error while getting student by card ID ${this.cardId}`, error);
        }
      });
  }

  populateForm(): void {
    this.studentForm = this.formBuilder.group({
      id: [this.student.id],
      firstName: [this.student.firstName, [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersOnly)]],
      middleName: [this.student.middleName, Validators.minLength(3)],
      lastName: [this.student.lastName, [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersOnly)]],
      cardId: [this.student.cardId, [Validators.required, Validators.min(100)]],
      rollNo: [this.student.rollNo, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      email: [this.student.email, [Validators.required, Validators.email]],
      mobile: [this.student.mobile, [Validators.required, Validators.pattern(this.mobileOnly)]],
      role: [this.student.role, Validators.required],
      gender: [this.student.gender, Validators.required],
      course: [this.student.course, Validators.required],
      branch: [this.student.branch, Validators.required],
    });
  }

  onSubmit() {
    console.log("---edit student---  : ", this.studentForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.studentForm.invalid) {
        return;
    }

    this.loading = true;

    this.studentService.update(this.studentForm.value)
    .pipe(first())
    .subscribe({
      next: (data: any) => {
        console.log("edited student successful! ", data);

         // default to login page
         this.router.navigateByUrl('/admin');
      },
      error: error => {
        console.error("Error while editing student! ", error);
        this.error = error;
        this.loading = false;
      }
    });
  }
}
