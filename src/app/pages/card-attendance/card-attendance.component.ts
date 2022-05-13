import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FacultyService } from 'src/app/services/faculty.service';

@Component({
  selector: 'app-card-attendance',
  templateUrl: './card-attendance.component.html',
  styleUrls: ['./card-attendance.component.css']
})
export class CardAttendanceComponent implements OnInit, AfterViewInit {

  rollNo: string = '';
  facultyId: string = '';
  cardId: string = '';

  subject: string | null = '';

  configs : any;
  attendanceForm: FormGroup = new FormGroup({});
  //user : any;

  submitted = false;
  loading = false;
  error = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private facultyService: FacultyService,
    private authService: AuthenticationService
  ) {
    //this.user = this.authService.userValue;
    this.facultyId = this.activatedRoute.snapshot.params['facultyId'];
    this.subject = this.activatedRoute.snapshot.params['subject'];
    console.log("-- faculty Id -- ", this.facultyId);

    // if(localStorage.getItem('subject') != null) {
    //   this.subject = localStorage.getItem('subject');
    // }
  }


  ngAfterViewInit(): void {
    this.attendanceForm.controls['cardId'].markAsTouched;
  }

  ngOnInit(): void {
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

  onChange(): void {
    let scannedCardId = this.attendanceForm.controls['cardId'].value;
    console.log (" -- scanned card Id -- ", scannedCardId);

    // let subject = this.attendanceForm.controls['subject'].value;
    console.log(' -- selected subject -- ', this.subject);

    // if(subject != null || subject != undefined) {
    //   localStorage.setItem('subject', subject);
    // }

    // if(scannedCardId.length === 7) {
      this.onSubmit();
      // window.location.reload();
      
    // }
    //this.attendanceForm.controls['cardId'].reset();
  }

  loadAttendanceForm() {
    let d = new Date();
    this.attendanceForm = this.formBuilder.group({
      facultyId: [this.facultyId],
      rollNo: [this.rollNo],
      cardId: [this.cardId, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      date: [d.toJSON(), Validators.required],
      year: [d.getFullYear(), Validators.required],
      month: [d.getMonth(), Validators.required],
      status: ['PRESENT', Validators.required],
      subject: [this.subject, Validators.required]
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

  // convenience getter for easy access to form fields
  get f() { return this.attendanceForm.controls; }

  onSubmit() {
    console.log("---add attendance for card---  : ", this.attendanceForm.value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.attendanceForm.invalid) {
        return;
    }

    this.loading = true;

    let d = new Date();

    let attendanceDTO = {
      facultyId: this.facultyId,
      rollNo: this.rollNo,
      cardId: this.attendanceForm.controls['cardId'].value,
      date: d.toJSON(),
      year: d.getFullYear(),
      month: d.getMonth(),
      status: 'PRESENT',
      subject: this.subject
    }

    console.log("-- attendance dto -- ", attendanceDTO);

    this.facultyService.addAttendance(attendanceDTO)
    .subscribe({
      next: (data: any) => {
        console.log("added attendance successful! ", data);
        this.loading = false;
        this.submitted = false;
        this.attendanceForm.controls['cardId'].patchValue('');
        this.attendanceForm.controls['cardId'].updateValueAndValidity();
      },
      error: error => {
        console.error("Error while adding attendance! ", error);
        this.error = error;
        this.loading = false;
      }
    });

  }

}
