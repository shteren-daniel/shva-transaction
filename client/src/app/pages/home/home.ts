import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  Country,
} from '../../services/country.service';

import { TransactionStore }
from '../../stores/transaction.store';

import { TransactionFacade }
from '../../facades/Transaction.facade';

import { ErrorService }
from '../../services/error.service';

import { CountryFacade }
from '../../facades/country.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {

  /* =====================================================
     INJECT
  ===================================================== */

  private readonly countryFacade =
    inject(CountryFacade);

  private readonly transactionFacade =
    inject(TransactionFacade);

  readonly errorService =
    inject(ErrorService);

  private readonly sanitizer =
    inject(DomSanitizer);

  readonly store =
    inject(TransactionStore);

  /* =====================================================
     STATE
  ===================================================== */

  readonly countries =
    this.countryFacade.countries;

  readonly countrySearch =
    signal('');

  readonly dropdownOpen =
    signal(false);

  readonly selectedCountry =
    signal('IL');

  readonly selectedTime =
    signal('12:00');

  readonly amount =
    signal<number | null>(null);

  readonly loading =
    signal(false);

  /* =====================================================
     COMPUTED
  ===================================================== */

  readonly filteredCountries = computed(() => {

    const search =
      this.countrySearch()
        .toLowerCase()
        .trim();

    if (!search) {
      return this.countries();
    }

    return this.countries().filter(c =>
      c.name.toLowerCase().includes(search)
    );
  });

  ngOnInit() {

    this.countryFacade.loadCountries();
  }

  /* =====================================================
     DROPDOWN
  ===================================================== */

  openDropdown(): void {

    this.dropdownOpen.set(true);
  }

  closeDropdown(): void {

    setTimeout(() => {
      this.dropdownOpen.set(false);
    }, 150);
  }

  selectCountry(country: Country): void {

    this.selectedCountry.set(country.code);

    this.countrySearch.set(country.name);

    this.dropdownOpen.set(false);

    this.errorService.clear();
  }

  /* =====================================================
     TIME
  ===================================================== */

  onTimeChange(value: string): void {

    this.selectedTime.set(value);

    this.errorService.clear();
  }

  /* =====================================================
     AMOUNT
  ===================================================== */

  onAmountChange(value: string): void {

    this.amount.set(Number(value));

    this.errorService.clear();
  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  onSubmit(): void {

    this.loading.set(true);

    this.errorService.clear();

    this.transactionFacade.createTransaction(
      this.selectedCountry(),
      this.selectedTime(),
      this.amount() ?? 0
    )
    .subscribe({

      next: () => {

        this.loading.set(false);
      },

      error: () => {

        this.loading.set(false);
      }
    });
  }

  /* =====================================================
     HIGHLIGHT
  ===================================================== */

  highlightText(
    text: string,
    search: string
  ): SafeHtml {

    if (!search) {
      return text;
    }

    const escaped =
      search.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    const regex =
      new RegExp(`(${escaped})`, 'gi');

    const result =
      text.replace(
        regex,
        '<mark>$1</mark>'
      );

    return this.sanitizer
      .bypassSecurityTrustHtml(result);
  }
}