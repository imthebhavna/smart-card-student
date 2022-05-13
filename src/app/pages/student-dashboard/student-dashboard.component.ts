import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  cardId: string = '';
  student: any;
  studentFields: any = [];

  transactions: any = [];
  transactionFields: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private studentService: StudentService
  ) { 
    this.cardId = this.activatedRoute.snapshot.params['cardId'];
    console.log("got card ID: " + this.cardId);
    this.getStudent();
    this.getTransactions();
  }

  ngOnInit(): void {
  }

  getStudent(): void {
    this.studentService.getByCardIdOrEmail(this.cardId)
      .subscribe({
        next: (student: any) => {
          this.student = student;
          console.log("got student by card Id, student: ", this.student);
          if(student != null) {
            this.studentFields = Object.keys(student);
          }
        },
        error: error => {
          console.error(`Error while getting student by card ID ${this.cardId}`, error);
        }
      });
  }

  getTransactions(): void {
    this.studentService.getTransactions(this.cardId)
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          if(this.transactions.length > 0) {
            this.transactionFields = Object.keys(transactions[0]);
            console.log("transaction fields: ", this.transactionFields);
          }
          console.log("got transactions by card Id, student: ", this.transactions);
        },
        error: error => {
          console.error(`Error while getting transactions by card ID ${this.cardId}`, error);
        }
      });
  }

}
