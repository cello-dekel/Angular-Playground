import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import {
  BehaviorSubject,
  Subject,
  Observable,
  combineLatest,
  withLatestFrom
} from 'rxjs';

import {
  delay,
  distinctUntilChanged,
  switchMap,
  startWith,
  tap,
  shareReplay,
  finalize,
  map
} from 'rxjs/operators';

import { CompaniesService } from '../companies.service';
import { DriversPagesService } from '../drivers-pages.service';
import { StartParkingService } from '../start-parking.service';
import { ActiveTransactionsService } from '../active-transactions.service';

import { IActiveTransaction, ICity, IDriver, ICompany } from '../models';

@Component({
  selector: 'app-active-transactions',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './active-transactions.html',
  styleUrl: './active-transactions.scss'
})
export class ActiveTransactions implements OnInit {

  // demo signal for UI
  reloadCount = signal(0);

  // loading as a signal
  listLoading = signal(false);

  companies$!: Observable<ICompany[]>;
  customers$!: Observable<IDriver[]>;
  cities$!: Observable<ICity[]>;
  activeTransactions$!: Observable<IActiveTransaction[]>;
  filteredCityNames$!: Observable<string[]>;

  private activeReload$ = new Subject<void>();
  private citySearch$ = new BehaviorSubject<string>('');

  constructor(
    public companiesService: CompaniesService,
    private driversPagesService: DriversPagesService,
    private startParkingService: StartParkingService,
    private activeTransactionsService: ActiveTransactionsService
  ) {}

  ngOnInit(): void {
    // static companies list
    this.companies$ = this.companiesService.getCompanies();

    // main company stream (BehaviorSubject from service)
    const company$ = this.companiesService.selectedCompany$.pipe(
      distinctUntilChanged(),
      tap(id => {
        if (id != null) {
          this.resetFilters();
        }
      }),
      startWith(null)
    );

    // drivers filtered by company (changes whenever company changes)
    this.customers$ = company$.pipe(
      switchMap(companyId =>
        this.driversPagesService.getDriversByCompany(companyId)
      ),
      shareReplay(1)
    );

    // cities (doesn't really depend on company, just re-fetched for demo)
    this.cities$ = company$.pipe(
      switchMap(() => this.startParkingService.getAllCities()),
      shareReplay(1)
    );

    // filtered city names (cities$ + search)
    this.filteredCityNames$ = combineLatest([
      this.cities$,
      this.citySearch$.pipe(startWith(''))
    ]).pipe(
      map(([cities, search]) => {
        const term = (search || '').toLowerCase();
        return cities
          .map((c: ICity) => c.name)
          .filter((name: string) => name.toLowerCase().includes(term));
      })
    );

    /**
     * Active transactions:
     * - ONLY driven by reload button (activeReload$)
     * - Uses withLatestFrom(company$) to grab the latest companyId
     * - So changing company alone DOES NOT reload activeTransactions$
     */
    this.activeTransactions$ = this.activeReload$.pipe(
      startWith(null),              // initial load once
      withLatestFrom(company$),     // [reloadEvent, companyId]
      switchMap(([_, companyId]) => {
        this.listLoading.set(true);

        return this.loadActiveParkingTransactions$(companyId).pipe(
          finalize(() => {
            this.listLoading.set(false);
          })
        );
      }),
      shareReplay(1)
    );
  }

  // simulate API: drivers → active transactions with artificial delay
  private loadActiveParkingTransactions$(
    companyId: number | null
  ): Observable<IActiveTransaction[]> {
    return this.driversPagesService.getDriversByCompany(companyId).pipe(
      switchMap((drivers: IDriver[]) => {
        const ids = companyId == null ? null : drivers.map(d => d.id);

        return this.activeTransactionsService.getActiveTransactions(ids).pipe(
          delay(3000) // 3s so you clearly see "Loading..."
        );
      })
    );
  }

  // fired by <select (change)>
  onCompanyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = select.value ? Number(select.value) : null;
    this.companiesService.selectCompany(id);

    // IMPORTANT: no activeReload$.next() here
    // Changing company should not reload activeTransactions$ automatically.
  }

  // fired by "Reload Active Transactions" button
  reloadActive(): void {
    this.reloadCount.update(v => v + 1);
    this.activeReload$.next();   // only this triggers activeTransactions$ reload
  }

  onCitySearch(value: string): void {
    this.citySearch$.next(value);
  }

  private resetFilters(): void {
    this.citySearch$.next('');
  }
}
