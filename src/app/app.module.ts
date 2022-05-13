import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PaymentDashboardComponent } from './pages/payment-dashboard/payment-dashboard.component';
import { AuthenticationService } from './services/authentication.service';
import { StudentService } from './services/student.service';
import { AuthGuard } from './services/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { UserService } from './services/user.service';
import { AddStudentComponent } from './pages/add-student/add-student.component';
import { ViewStudentsComponent } from './pages/view-students/view-students.component';
import { EditStudentComponent } from './pages/edit-student/edit-student.component';
import { RechargeComponent } from './pages/recharge/recharge.component';
import { MarkAttendanceComponent } from './pages/mark-attendance/mark-attendance.component';
import { FacultyService } from './services/faculty.service';
import { CardAttendanceComponent } from './pages/card-attendance/card-attendance.component';
import { FacultyDashboardComponent } from './pages/faculty-dashboard/faculty-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StudentDashboardComponent,
    AdminDashboardComponent,
    FacultyDashboardComponent,
    PaymentDashboardComponent,
    AddStudentComponent,
    ViewStudentsComponent,
    EditStudentComponent,
    RechargeComponent,
    MarkAttendanceComponent,
    CardAttendanceComponent,
    FacultyDashboardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService,
    StudentService,
    UserService,
    FacultyService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
