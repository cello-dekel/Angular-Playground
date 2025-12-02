import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ICity } from './models';

@Injectable({
  providedIn: 'root'
})
export class StartParkingService {
  private cities: ICity[] = [
    { id: 1, name: 'Tel Aviv' },
    { id: 2, name: 'Jerusalem' },
    { id: 3, name: 'Haifa' },
    { id: 4, name: 'Beer Sheva' }
  ];

  getAllCities(): Observable<ICity[]> {
    return of(this.cities).pipe(delay(400));
  }
}
