import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private _errors = signal<string[]>([]);

  errors = this._errors.asReadonly();

  setErrors(errors: string[]) {
    this._errors.set([...errors]); 
  }

  clear() {
    this._errors.set([]);
  }
}