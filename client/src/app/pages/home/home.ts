import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Country, CountryService } from '../../services/country.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Transaction {
  country: string;
  time: string;
  createdAt: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  countries: Country[] = [];
  countrySearch = '';
  filteredCountries = this.countries;
  dropdownOpen = false;
  transactions = signal<Transaction[]>([]);
  selectedCountry = 'IL';
  selectedTime = '12:00';

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @ViewChild('errorBox', { static: false })
  errorBox?: ElementRef<HTMLDivElement>;
  private notifTimer?: any;

  constructor(
    private transactionService: TransactionService,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.countries = this.countryService.getCountriesLib();
    this.filteredCountries = [...this.countries];
    // this.countryService.getCountriesFromApi().subscribe({
    //   next: (countries) => {
    //     this.countries = countries;
    // this.filteredCountries = [...this.countries];
    //   },
    //   error: () => {
    //     this.showError('טעינת המדינות נכשלה');
    //   },
    // });
  }

  onCountrySearchChange(value: string) {
    this.countrySearch = value;

    this.filteredCountries = this.countries.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase()),
    );

    this.dropdownOpen = true;
  }

  highlightText(text: string, search: string): SafeHtml {
    if (!search) return text;

    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');

    const result = text.replace(regex, `<mark>$1</mark>`);

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

  openDropdown() {
    this.dropdownOpen = true;
  }

  closeDropdown() {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 150);
  }

  onCountryChange() {
    this.dismissError();
    this.dismissSuccess();
  }

  selectCountry(country: any) {
    this.selectedCountry = country.code;
    this.countrySearch = country.name;
    this.dropdownOpen = false;
  }

  onTimeChange(value?: string) {
    if (value) {
      this.selectedTime = value;
    }

    this.dismissError();
    this.dismissSuccess();
  }

  private sanitizeErrorText(raw: string): string {
    if (!raw) {
      return '';
    }
    const stripped = raw
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return stripped || raw;
  }

  private clearNotifTimer() {
    if (this.notifTimer) {
      clearTimeout(this.notifTimer);
      this.notifTimer = undefined;
    }
  }

  showError(message: string, autoHide = false, ms = 6000) {
    this.clearNotifTimer();
    this.errorMessage = message;
    this.cdr.detectChanges();

    setTimeout(() => {
      try {
        this.errorBox?.nativeElement.focus();
      } catch {
        // ignore
      }
    }, 50);

    if (autoHide) {
      this.notifTimer = setTimeout(() => this.dismissError(), ms);
    }
  }

  dismissError() {
    this.clearNotifTimer();
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  showSuccess(message: string, autoHide = true, ms = 3000) {
    this.clearNotifTimer();
    this.successMessage = message;
    this.cdr.detectChanges();

    if (autoHide) {
      this.notifTimer = setTimeout(() => this.dismissSuccess(), ms);
    }
  }

  dismissSuccess() {
    this.clearNotifTimer();
    this.successMessage = null;
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();

    this.transactionService
      .insertTransaction(this.selectedCountry, this.selectedTime)
      .subscribe({
        next: () => {
          this.loading = false;
          this.transactions.update((current) => [
            {
              country: this.selectedCountry,
              time: this.selectedTime,
              createdAt: new Date(),
            },
            ...current,
          ]);
          this.showSuccess('נשלח בהצלחה');
        },
        error: (err) => {
          this.loading = false;
          const raw = err?.error || err?.message || 'שגיאה בשליחת הבקשה';
          const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
          this.showError(this.sanitizeErrorText(text), false);
        },
      });
  }
}
