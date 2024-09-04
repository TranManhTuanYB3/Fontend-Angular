import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080/api/v1/employee/'

  getData(): Observable<{ code: number; message: string; result: Employee[] }> {
    return this.http.get<{ code: number; message: string; result: Employee[] }>(this.url + 'get')
  }

  searchData(textSearch: Employee, currentPage: number, limit: number): Observable<{ code: number; message: string; result: Employee[]; totalRecords: number }> {
    return this.http.post<{ code: number; message: string; result: Employee[]; totalRecords: number }>(this.url + 'search' + `?currentPage=${currentPage}&limitPage=${limit}`, textSearch)
  }

  addData(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.url + 'add', employee)
  }
  
  updateData(employee: Employee): Observable<Employee> {    
    return this.http.put<Employee>(this.url + 'update/' + employee.id, employee);
  }  

  deleteData(id: number): Observable<Employee> {
    return this.http.delete<Employee>(this.url + 'delete/' + id)
  }

  getNoId(): Observable<{ code: number; message: string; result: Employee[] }> {
    return this.http.get<{ code: number; message: string; result: Employee[] }>(this.url + 'getnoid')
  }

  getId(id?: number): Observable<{ code: number; message: string; result: Employee[] }> {
    return this.http.get<{ code: number; message: string; result: Employee[] }>(this.url + `getid?id=${id}`)
  }
}
