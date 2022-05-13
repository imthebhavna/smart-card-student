import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FacultyService } from 'src/app/services/faculty.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css']
})
export class ViewStudentsComponent implements OnInit {

  user: any;
  faculty: any;
  students: any = [];
  error = '';

  fieldNames: any = [];
  isAdmin: any;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private authService: AuthenticationService,
    private facultyService: FacultyService
  ) { 
    this.isAdmin = this.authService.isAdmin;
    this.user = this.authService.userValue;
    if(this.user.role.authority == 'ROLE_FACULTY') {
      this.facultyService.getByEmailOrFacultyId(this.user.username).subscribe({
        next: (data: any) => {
          this.faculty = data;
          console.log("-- faculty data -- ", this.faculty);
        },
        error: error => {
          this,error = error;
          console.error("Error while getting faculty by id or email! ", error);
        }
      });
    }
  }

  ngOnInit(): void {
    this.studentService.getAll().subscribe({
      next: (data: any) => {
        this.students = data;
        console.log('got all the students: ', this.students);

        if(this.students.length >= 0) {
          this.fieldNames = Object.keys(this.students[0]);
          console.log('field names: ', this.fieldNames);
        }
      },
      error: error => {
        this.error = error;
        console.error("Error while get all students for admin! ", error);
      }
    });
  }

  delete(student: any) {
    console.log("do you want to delete? : ", student);
    if(confirm(`Are you sure, you want to delete ${student.firstName} having card ID: ${student.cardId} ?`)) {
      console.log(`deleting student with card ID: ${student.cardId} and student ID: ${student.id}`);

      this.studentService.removeById(student.id)
        .subscribe({
          next: (deletedStudent: any) => {
            console.log('Successfully deleted student: ', deletedStudent);
            window.location.reload();
          },
          error: error => {
            this.error = error;
            console.log("Error while deleting student with ID: " + student.id + " and card ID:" + student.cardId);
          }
        });
    }
  }


  edit(student: any) {
    console.log("edit student: ", student);
    this.router.navigate(['/edit-student/'+student.cardId]);
  }

  markAttendance(student: any) {
    console.log(`mark attendance for student rollNo : ${student.rollNo} and faculty id : ${this.faculty.id}`);
    console.log("sending student data from 1 page to another: ", student);
    this.router.navigate(['/mark-attendance/'+student.rollNo+'/'+this.faculty.id], {
      state: {
        data: student
      }
    });
  }

}
