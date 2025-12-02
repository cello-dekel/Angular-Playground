export interface ICompany {
  id: number;
  name: string;
}

export interface IDriver {
  id: number;
  name: string;
  companyId: number | null;
}

export interface ICity {
  id: number;
  name: string;
}

export interface IActiveTransaction {
  id: number;
  driverId: number;
  cityId: number;
  startedAt: Date;
}
