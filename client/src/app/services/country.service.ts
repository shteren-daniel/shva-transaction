import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import * as countriesLib from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

countriesLib.registerLocale(en);

export interface Country {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  getCountriesLib() {
  const list = countriesLib.getNames('en', { select: 'official' });

  return Object.entries(list).map(([code, name]) => ({
    code,
    name,
  }));
}

  getCountriesFromApi() {
    return this.http
      .get<any[]>(
        'https://restcountries.com/v3.1/all?fields=name,cca2'
      )
      .pipe(
        map((countries) =>
          countries
            .map((c) => ({
              code: c.cca2,
              name: c.name.common,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
      );
  }
}