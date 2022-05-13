import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentComponent } from './pages/add-student/add-student.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CardAttendanceComponent } from './pages/card-attendance/card-attendance.component';
import { EditStudentComponent } from './pages/edit-student/edit-student.component';
import { LoginComponent } from './pages/login/login.component';
import { PaymentDashboardComponent } from './pages/payment-dashboard/payment-dashboard.component';
import { RechargeComponent } from './pages/recharge/recharge.component';
import { RegisterComponent } from './pages/register/register.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { MarkAttendanceComponent } from './pages/mark-attendance/mark-attendance.component';
import { ViewStudentsComponent } from './pages/view-students/view-students.component';
import { AuthGuard } from './services/auth.guard';
import { FacultyDashboardComponent } from './pages/faculty-dashboard/faculty-dashboard.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'student/:cardId', 
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_STUDENT', 'ROLE_ADMIN']}
  },
  {
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'add-student',
    component: AddStudentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'edit-student/:cardId',
    component: EditStudentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'view-students',
    component: ViewStudentsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_FACULTY'] }
  },
  {
    path: 'faculty',
    component: FacultyDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_FACULTY'] }
  },
  {
    path: 'mark-attendance/:rollNo/:facultyId',
    component: MarkAttendanceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_FACULTY'] }
  },
  {
    path: 'recharge',
    component: RechargeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'card-attendance/:facultyId/:subject',
    component: CardAttendanceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_FACULTY'] }
  },
  {
    path: 'payment', 
    component: PaymentDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CANTEEN', 'ROLE_LIBRARY', 'ROLE_STATIONARY']}
  },
  {path: 'home', component: AdminDashboardComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
