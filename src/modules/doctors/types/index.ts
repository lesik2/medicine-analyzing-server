import { Specialty, TypesOfShifts } from '@/types';
import { SortDirection } from '@/types/sortDirection';

export interface DoctorResponseEntity {
  id: string;
  fullName: string;
  specialty: Specialty;
  typeOfShifts: TypesOfShifts;
  officeNumber: number;
}

export interface GetAllDoctorsResponse {
  total: number;
  items: DoctorResponseEntity[];
}

export interface getAllDoctorsQuery {
  sortKey?: string;
  sortDirection?: SortDirection;
  page: number;
  perPage: number;
}
