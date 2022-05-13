import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private http: HttpClient) { }

  getByEmailOrFacultyId(param: string) {
    return this.http.get<any>(`${environment.domain}/api/faculties/${param}`);
  }

  getAttendance(dto: any) {
    return this.http.post<any>(`${environment.domain}/api/attendances/search`, dto);
  }

  getAttendanceConfigs() {
    return this.http.get<any>(`${environment.domain}/api/attendances/configurations`);
  }

  addAttendance(dto: any) {
    console.log(" sending http request to add attendance ...");
    return this.http.post<any>(`${environment.domain}/api/attendances/`, dto);
  }
}
