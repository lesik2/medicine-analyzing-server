import { Specialty, Status, TypesOfShifts } from '@/types';
import { SortDirection } from '@/types/sortDirection';

export interface getFreeOfficesQuery {
  typeOfShifts: TypesOfShifts;
  specialty: Specialty;
}

export interface getAllOfficesQuery {
  sortKey?: string;
  sortDirection?: SortDirection;
  page: number;
  perPage: number;
}

export interface OfficeResponseEntity {
  id: string;
  number: number;
  specialty: Specialty;
  doctors: {
    id: string;
    fullName: string;
    typeOfShifts: TypesOfShifts;
  }[];
  status: Status;
}

export interface GetAllOfficeResponse {
  total: number;
  items: OfficeResponseEntity[];
}

export interface FreeOffice {
  key: string;
  value: {
    availableShifts: string[];
    id: string;
    number: number;
    specialty: Specialty;
  };
}
