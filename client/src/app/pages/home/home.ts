import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';


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
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'IL', name: 'Israel' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IN', name: 'India' },
  ];

  transactions = signal<Transaction[]>([]);
  selectedCountry = 'IL';
  selectedTime = '12:00';

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @ViewChild('errorBox', { static: false }) errorBox?: ElementRef<HTMLDivElement>;
  private notifTimer?: any;

  constructor(
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  onCountryChange() {
    this.dismissError();
    this.dismissSuccess();
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
    const stripped = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
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

    this.transactionService.insertTransaction(this.selectedCountry, this.selectedTime).subscribe({
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
