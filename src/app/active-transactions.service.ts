import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { IActiveTransaction } from './models';

@Injectable({
  providedIn: 'root'
})
export class ActiveTransactionsService {
  private transactions: IActiveTransaction[] = [
    { id: 1, driverId: 1, cityId: 1, startedAt: new Date() },
    { id: 2, driverId: 2, cityId: 2, startedAt: new Date() },
    { id: 3, driverId: 3, cityId: 3, startedAt: new Date() },
    { id: 4, driverId: 4, cityId: 1, startedAt: new Date() }
  ];

  getActiveTransactions(companyDriverIds: number[] | null): Observable<IActiveTransaction[]> {
    return of(this.transactions).pipe(
      delay(600),
      map(list =>
        companyDriverIds == null
          ? list
          : list.filter(tx => companyDriverIds.includes(tx.driverId))
      )
    );
  }
}
