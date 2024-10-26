import { Specialty } from '@/types';

export interface getTimeSlotsQuery {
  doctorId: string;
  date: string;
}

export interface getWorkloadQuery {
  workloadBy: 'doctors' | 'offices';
}

export interface AppointmentResponse {
  id: string;
  dateAndTime: string;
  patientFullName: string;
  specialty: Specialty;
  doctorFullName: string;
  officeNumber: number | undefined;
}

export interface AppointmentResponseByPatient {
  upcoming: AppointmentResponse[];
  history: AppointmentResponse[];
}
