import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { IDriver } from './models';

@Injectable({
  providedIn: 'root'
})
export class DriversPagesService {
  private drivers: IDriver[] = [
    { id: 1, name: 'Alice Driver', companyId: 1 },
    { id: 2, name: 'Bob Driver', companyId: 2 },
    { id: 3, name: 'Charlie Driver', companyId: 1 },
    { id: 4, name: 'Dana Driver', companyId: 3 }
  ];

  getAllDrivers(): Observable<IDriver[]> {
    return of(this.drivers).pipe(delay(500));
  }

  getDriversByCompany(companyId: number | null): Observable<IDriver[]> {
    return this.getAllDrivers().pipe(
      map(drivers =>
        companyId == null
          ? drivers
          : drivers.filter(d => d.companyId === companyId)
      )
    );
  }
}
