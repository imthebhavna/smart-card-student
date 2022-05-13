import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {
    this
   }

  getAll() {
    return this.http.get<any>(`${environment.domain}/api/students/`);
  }

  getByCardIdOrEmail(cardId: string) {
    return this.http.get<any>(`${environment.domain}/api/students/${cardId}`);
  }

  add(student: any) {
    return this.http.post<any>(`${environment.domain}/api/students/`, student);
  }

  update(student: any) {
    return this.http.put<any>(`${environment.domain}/api/students/`, student);
  }

  removeById(studentId: string) {
    return this.http.delete<any>(`${environment.domain}/api/students/${studentId}`);
  }

  getTransactions(cardId: string) {
    return this.http.get<any>(`${environment.domain}/transactions/${cardId}`);
  }

  recharge(rechargeStudent: any) {
    return this.http.post<any>(`${environment.domain}/recharge`, rechargeStudent);
  }
  
  pay(studentPayment: any) {
    return this.http.post<any>(`${environment.domain}/pay`, studentPayment);
  }

  getAllConfigurations() {
    return this.http.get<any>(`${environment.domain}/api/students/configurations`);
  }

}
