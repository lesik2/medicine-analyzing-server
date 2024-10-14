import { Doctor } from '@/modules/doctors/models/doctor.entity';
import { Status, TypesOfShifts } from '@/types';

export const getOfficeStatus = (doctors: Doctor[]) => {
  const hasFullShift = doctors.some(
    (doctor) => doctor.typeOfShifts === TypesOfShifts.FULL_SHIFT,
  );
  const hasFirstShift = doctors.some(
    (doctor) => doctor.typeOfShifts === TypesOfShifts.FIRST_SHIFT,
  );
  const hasSecondShift = doctors.some(
    (doctor) => doctor.typeOfShifts === TypesOfShifts.SECOND_SHIFT,
  );

  if (hasFullShift || (hasFirstShift && hasSecondShift)) {
    return Status.FILLED;
  } else if (doctors.length === 1) {
    return Status.PARTIALLY_FILLED;
  } else {
    return Status.EMPTY;
  }
};
