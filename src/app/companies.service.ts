import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ICompany } from './models';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private _selectedCompany$ = new BehaviorSubject<number | null>(null);
  selectedCompany$ = this._selectedCompany$.asObservable();

  private companies: ICompany[] = [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
    { id: 3, name: 'Company C' }
  ];

  getCompanies(): Observable<ICompany[]> {
    return of(this.companies).pipe(delay(300));
  }

  selectCompany(id: number | null): void {
    this._selectedCompany$.next(id);
  }
}
