import { Injectable, inject, signal } from "@angular/core";
import { CountryService, Country } from "../services/country.service";

@Injectable({ providedIn: 'root' })
export class CountryFacade {

  private readonly countryService = inject(CountryService);

  readonly countries = signal<Country[]>([]);

  loadCountries() {
    this.countries.set(
      this.countryService.getCountriesLib()
    );
  }
}