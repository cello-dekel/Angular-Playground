import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTransactions } from './active-transactions';

describe('ActiveTransactions', () => {
  let component: ActiveTransactions;
  let fixture: ComponentFixture<ActiveTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
