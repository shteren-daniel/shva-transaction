import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CountryService } from './country.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly endpoint = `${environment.apiUrl}/api/transactions`;

  constructor(
    private http: HttpClient,
    private countryService: CountryService,
  ) {}

  insertTransaction(
    country: string,
    time: string,
    amount: number,
  ): Observable<any> {
    var ClientTimeUtc  = this.countryService.convertTimeToUtc(time, country);
    return this.http.post(`${this.endpoint}/insertTransaction`, {
      country,
      ClientTimeUtc,
      amount,
    });
  }
}
