import {
  Injectable,
  inject
} from '@angular/core';

import { tap }
from 'rxjs/operators';

import { TransactionService }
from '../services/transaction.service';

import { TransactionStore }
from '../stores/transaction.store';

@Injectable({
  providedIn: 'root'
})
export class TransactionFacade {

  private readonly api =
    inject(TransactionService);

  private readonly store =
    inject(TransactionStore);

  createTransaction(
    country: string,
    time: string,
    amount: number
  ) {

    return this.api
      .insertTransaction(
        country,
        time,
        amount
      )
      .pipe(

        tap(() => {

          this.store.add({
            country,
            time,
            amount,
            createdAt: new Date()
          });
        })
      );
  }
}