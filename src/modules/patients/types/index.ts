import { AgeCategory } from '@/types';
import { Patient } from '../models/patient.entity';

export interface PatientProfile {
  id: number;
  ageCategory: AgeCategory;
  patient: Patient | null;
}
