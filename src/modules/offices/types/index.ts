import { Specialty, TypesOfShifts } from '@/types';
import { SortDirection } from '@/types/sortDirection';

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
}

export interface GetAllOfficeResponse {
  total: number;
  items: OfficeResponseEntity[];
}
