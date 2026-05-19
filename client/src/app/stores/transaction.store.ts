import {
  Injectable,
  signal
} from '@angular/core';

export interface Transaction {
  country: string;
  time: string;
  amount: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionStore {

  private readonly _transactions =
    signal<Transaction[]>([]);

  readonly transactions =
    this._transactions.asReadonly();

  add(
    transaction: Transaction
  ): void {

    this._transactions.update(current => [

      transaction,

      ...current
    ]);
  }
}