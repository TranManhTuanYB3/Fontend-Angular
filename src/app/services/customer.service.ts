import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080/api/v1/customer/'

  getData(): Observable<{ code: number; message: string; result: Customer[] }> {
    return this.http.get<{ code: number; message: string; result: Customer[] }>(this.url + 'get')
  }

  searchData(textSearch: Customer, currentPage: number, limit: number): Observable<{ code: number; message: string; result: Customer[]; totalRecords: number }> {
    return this.http.post<{ code: number; message: string; result: Customer[]; totalRecords: number }>(this.url + 'search' + `?currentPage=${currentPage}&limitPage=${limit}`, textSearch)
  }

  addData(customer: Customer): Observable<Customer> {    
    return this.http.post<Customer>(this.url + 'add', customer)
  }
  
  updateData(customer: Customer): Observable<Customer> {    
    return this.http.put<Customer>(this.url + 'update/' + customer.id, customer);
  }  

  deleteData(id: number): Observable<Customer> {
    return this.http.delete<Customer>(this.url + 'delete/' + id)
  }
}
