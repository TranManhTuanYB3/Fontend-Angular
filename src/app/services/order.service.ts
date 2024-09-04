import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080/api/v1/order/'

  getData(): Observable<{ code: number; message: string; result: Order[] }> {
    return this.http.get<{ code: number; message: string; result: Order[] }>(this.url + 'get')
  }

  searchData(textSearch: Order, currentPage: number, limit: number): Observable<{ code: number; message: string; result: Order[]; totalRecords: number }> {
    return this.http.post<{ code: number; message: string; result: Order[]; totalRecords: number }>(this.url + 'search' + `?currentPage=${currentPage}&limitPage=${limit}`, textSearch)
  }

  addData(order: Order): Observable<Order> {    
    return this.http.post<Order>(this.url + 'add', order)
  }
  
  updateData(order: Order): Observable<Order> {    
    return this.http.put<Order>(this.url + 'update/' + order.id, order);
  }  

  deleteData(id: number): Observable<Order> {
    return this.http.delete<Order>(this.url + 'delete/' + id)
  }
}
