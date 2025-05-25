import { TypesOfShifts } from '@/types';

export const getTimeOfShifts = {
  [TypesOfShifts.FIRST_SHIFT]: { start: '08:00', end: '13:00' },
  [TypesOfShifts.SECOND_SHIFT]: { start: '14:00', end: '18:50' },
  [TypesOfShifts.FULL_SHIFT]: { start: '08:00', end: '18:50' },
};
