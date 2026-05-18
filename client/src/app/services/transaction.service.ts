import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly endpoint = `${environment.apiUrl}/api/transactions`;

  constructor(private http: HttpClient) {}

  insertTransaction(country: string, time: string): Observable<any> {
    return this.http.post(`${this.endpoint}/insertTransaction`, { country, time });
  }
}
