import { Test } from '@nestjs/testing';
import {AppointmentController} from './appointment.controller'
import {AppointmentService} from './appointment.service'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { TypesOfShifts } from '../../types/index';
import * as moment from 'moment';
import {getTimeOfShifts} from '../../common/getTimeOfShifts'


const moduleMocker = new ModuleMocker(global);

describe('AppointmentController', () => {
  let appointmentController: AppointmentController;
  let appointmentService: AppointmentService;


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppointmentController],
    })
      .useMocker((token) => {
        if (token === AppointmentService) {
          return {
            getWorkingMinutes: jest.fn((shiftType: TypesOfShifts)=> {
                const { start, end } = getTimeOfShifts[shiftType];
                const startTime = moment(start, 'HH:mm');
                const endTime = moment(end, 'HH:mm');
                return endTime.diff(startTime, 'minutes');
              }
            )
          };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    appointmentService = moduleRef.get<AppointmentService>(AppointmentService);
    appointmentController = moduleRef.get<AppointmentController>(AppointmentController);
  });

  it('should be defined', () => {
    expect(appointmentController).toBeDefined();
  });

  describe('getWorkingMinutes', () => {
    it('should return correct working minutes for FIRST_SHIFT', () => {
        const expectedResult = 300
      const shiftType: TypesOfShifts = TypesOfShifts.FIRST_SHIFT;
      const minutes = appointmentService.getWorkingMinutes(shiftType);
      expect(minutes).toEqual(expectedResult);
    });

    it('should return correct working minutes for SECOND_SHIFT', () => {
        const expectedResult = 290;
        const shiftType: TypesOfShifts = TypesOfShifts.SECOND_SHIFT;
        const minutes = appointmentService.getWorkingMinutes(shiftType);
        expect(minutes).toEqual(expectedResult);
      });
    
      it('should return correct working minutes for FULL_SHIFT', () => {
        const expectedResult = 650;
        const shiftType: TypesOfShifts = TypesOfShifts.FULL_SHIFT;
        const minutes = appointmentService.getWorkingMinutes(shiftType);
        expect(minutes).toEqual(expectedResult);
      });
  });
});
