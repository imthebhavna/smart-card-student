import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { FacultyService } from 'src/app/services/faculty.service';

@Component({  
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.css']
})
export class MarkAttendanceComponent implements OnInit {

  attendanceForm: FormGroup = new FormGroup({});

  rollNo: string = '';
  facultyId: string = '';
  configs : any;
  
  attendances = [];
  fieldNames: any = [];

  submitted = false;
  loading = false;
  error = '';
  cardId = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private facultyService: FacultyService,
    private router: Router
  ) {
    this.rollNo = this.activatedRoute.snapshot.params['rollNo'];
    this.facultyId = this.activatedRoute.snapshot.params['facultyId'];

    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state && navigation?.extras.state['data']) {
      let student = navigation?.extras.state['data'];
      console.log(" -- -- -- student -- -- -- ", student);
      this.cardId = student?.cardId;
      console.log(" card Id: ", this.cardId);
    }
    

    console.log(`rollNo: ${this.rollNo} facultyId: ${this.facultyId}`);  
   }

  ngOnInit(): void {
    this.getAttendance(this.rollNo, this.facultyId);
    this.getConfigs();
    this.loadAttendanceForm();

    this.attendanceForm.get('date')?.valueChanges.subscribe(date => {
      let d = new Date(date);

      this.attendanceForm.controls['month'].setValue(d.getMonth());
      this.attendanceForm.controls['month'].updateValueAndValidity();

      this.attendanceForm.controls['year'].setValue(d.getFullYear());
      this.attendanceForm.controls['year'].updateValueAndValidity();
    });
  }

  loadAttendanceForm() {
    let d = new Date();
    this.attendanceForm = this.formBuilder.group({
      facultyId: [this.facultyId],
      rollNo: [this.rollNo],
      cardId: [this.cardId],
      date: [d.toJSON(), Validators.required],
      year: [d.getFullYear(), Validators.required],
      month: [d.getMonth(), Validators.required],
      status: ['', Validators.required],
      subject: ['', Validators.required]
    });
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

  getAttendance(rollNo: any, facultyId: any) {
    let dto = {
      rollNo: this.rollNo,
      facultyId: this.facultyId
    }
    this.facultyService.getAttendance(dto).subscribe({
      next: (data: any) => {
        this.attendances = data;
        console.log("-- attendances -- ", this.attendances);
        if(this.attendances.length > 0) {
          this.fieldNames = Object.keys(this.attendances[0]);
          console.log('field names: ', this.fieldNames);
        }
      },
      error: error => {
        this.error = error;
        console.error("Error while getting attendance! ", error);
      }
    });
  }

   // convenience getter for easy access to form fields
   get f() { return this.attendanceForm.controls; }

  onSubmit() {
    console.log("---add attendance---  : ", this.attendanceForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.attendanceForm.invalid) {
        return;
    }
    this.loading = true;

    this.facultyService.addAttendance(this.attendanceForm.value)
    .pipe(first())
    .subscribe({
      next: (data: any) => {
        console.log("added attendance successful! ", data);

         // default to login page
         this.router.navigateByUrl('/');
      },
      error: error => {
        console.error("Error while adding attendance! ", error);
        this.error = error;
        this.loading = false;
      }
    });

  }
}
