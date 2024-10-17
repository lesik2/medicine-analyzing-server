import { Specialty, TypesOfShifts } from '@/types';
import { SortDirection } from '@/types/sortDirection';

export interface DoctorResponseEntity {
  id: string;
  fullName: string;
  specialty: Specialty;
  typeOfShifts: TypesOfShifts;
  officeNumber: number | null;
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
  filters?: {
    typeOfShifts: TypesOfShifts;
    specialty: Specialty;
    number: number;
  };
}

export interface DoctorResponse {
  id: string;
  email: string;
  fullName: string;
  specialty: Specialty;
  typeOfShifts: TypesOfShifts;
  office: {
    key: string;
    value: {
      id: string;
      number: number;
      specialty: Specialty;
      availableShifts: string[];
    };
  };
}
