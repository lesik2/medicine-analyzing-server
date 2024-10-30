import { Test } from '@nestjs/testing';
import {OfficesController} from './offices.controller'
import {OfficesService} from './offices.service'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Specialty, Status, TypesOfShifts } from '../../types/index';
import { Doctor } from '../doctors/models/doctor.entity';
import { CreateOfficeDto } from './dto/create-office-dto';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessages } from '../../common/error-messages';


const moduleMocker = new ModuleMocker(global);

describe('OfficeController', () => {
  let officesController: OfficesController;
  let officesService: OfficesService;


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OfficesController],
    })
      .useMocker((token) => {
        if (token === OfficesService) {
            const shiftOrder = {
                [TypesOfShifts.FIRST_SHIFT]: 1,
                [TypesOfShifts.SECOND_SHIFT]: 2,
                [TypesOfShifts.FULL_SHIFT]: 3,
              };
            const mockOffices = [{
                id:'1',
                number: 101,
                specialty: Specialty.CARDIOLOGY
            },{
                id:'2',
                number: 102,
                specialty: Specialty.DERMATOLOGY
            }]
          return {
            create: jest.fn((createOfficeDto: CreateOfficeDto)=> {
                const isOfficeNumberExist = mockOffices.some((mockOffice)=>mockOffice.number ===createOfficeDto.number)
            
                if (isOfficeNumberExist) {
                  throw new BadRequestException(ErrorMessages.OFFICE_NUMBER_ALREADY_EXISTS);
                }
               
                return createOfficeDto;
              }),
            findAll: jest.fn(()=>mockOffices),
            sortDoctorsByShift: jest.fn((doctors: Doctor[])=> {
                return doctors.sort(
                  (a, b) =>
                    shiftOrder[a.typeOfShifts] - shiftOrder[b.typeOfShifts],
                );
              }),
            getOfficeStatus: jest.fn((doctors: Doctor[]) =>{
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
              })
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

    officesService = moduleRef.get<OfficesService>(OfficesService);
    officesController = moduleRef.get<OfficesController>(OfficesController);
  });

  it('should be defined', () => {
    expect(officesController).toBeDefined();
  });

  describe('getOfficeStatus', () => {
    it('should return FILLED when there is a FULL_SHIFT doctor', () => {
        const doctors: Doctor[] = [
          { id: '1', name: 'John', surname: 'Doe', typeOfShifts: TypesOfShifts.FULL_SHIFT } as Doctor,
        ];
        const result = officesService.getOfficeStatus(doctors);
        expect(result).toEqual(Status.FILLED);
      });
  
      it('should return FILLED when there is both FIRST_SHIFT and SECOND_SHIFT doctors', () => {
        const doctors: Doctor[] = [
          { id: '1', name: 'John', surname: 'Doe', typeOfShifts: TypesOfShifts.FIRST_SHIFT } as Doctor,
          { id: '2', name: 'Jane', surname: 'Smith', typeOfShifts: TypesOfShifts.SECOND_SHIFT } as Doctor,
        ];
        const result = officesService.getOfficeStatus(doctors);
        expect(result).toEqual(Status.FILLED);
      });
  
      it('should return PARTIALLY_FILLED when there is only one doctor', () => {
        const doctors: Doctor[] = [
          { id: '1', name: 'John', surname: 'Doe', typeOfShifts: TypesOfShifts.FIRST_SHIFT } as Doctor,
        ];
        const result = officesService.getOfficeStatus(doctors);
        expect(result).toEqual(Status.PARTIALLY_FILLED);
      });
  
      it('should return EMPTY when there are no doctors', () => {
        const doctors: Doctor[] = [];
        const result = officesService.getOfficeStatus(doctors);
        expect(result).toEqual(Status.EMPTY);
      });
  
      it('should return EMPTY when there are multiple doctors but no shifts', () => {
        const doctors: Doctor[] = [
          { id: '1', name: 'John', surname: 'Doe', typeOfShifts: TypesOfShifts.SECOND_SHIFT } as Doctor,
          { id: '2', name: 'Jane', surname: 'Smith', typeOfShifts: TypesOfShifts.SECOND_SHIFT } as Doctor,
        ];
        const result = officesService.getOfficeStatus(doctors);
        expect(result).toEqual(Status.EMPTY);
      });
  });

  describe('sortDoctorsByShift', () => {
    it('should sort doctors by their shift types', () => {
      const doctors: Doctor[] = [
        { id: '1', name: 'Alice', surname: 'Smith', typeOfShifts: TypesOfShifts.SECOND_SHIFT } as Doctor,
        { id: '2', name: 'Bob', surname: 'Johnson', typeOfShifts: TypesOfShifts.FULL_SHIFT } as Doctor,
        { id: '3', name: 'Charlie', surname: 'Brown', typeOfShifts: TypesOfShifts.FIRST_SHIFT } as Doctor,
      ];

      const sortedDoctors = officesService.sortDoctorsByShift(doctors);

      expect(sortedDoctors).toEqual([
        { id: '3', name: 'Charlie', surname: 'Brown', typeOfShifts: TypesOfShifts.FIRST_SHIFT } as Doctor,
        { id: '1', name: 'Alice', surname: 'Smith', typeOfShifts: TypesOfShifts.SECOND_SHIFT } as Doctor,
        { id: '2', name: 'Bob', surname: 'Johnson', typeOfShifts: TypesOfShifts.FULL_SHIFT } as Doctor,
      ]);
    });
  });
  
  describe('findAll', () => {
    it('should return an array of offices', async () => {
      const expectedResult = [{
        id:'1',
        number: 101,
        specialty: Specialty.CARDIOLOGY
    },{
        id:'2',
        number: 102,
        specialty: Specialty.DERMATOLOGY
    }]

      const response = await officesService.findAll();

      expect(response).toEqual(expectedResult);
      expect(officesService.findAll).toHaveBeenCalledWith();
    });
  });


  describe('create', () => {
    it('should throw an error if the office number already exists', async () => {
      const createOfficeDto = { number: 101, specialty: Specialty.CARDIOLOGY };

      await expect(officesController.create(createOfficeDto)).rejects.toThrow(new BadRequestException(ErrorMessages.OFFICE_NUMBER_ALREADY_EXISTS));
    });

    it('should create and save a new office if the office number does not exist', async () => {
      const createOfficeDto = { number: 103, specialty: Specialty.DERMATOLOGY };
      const result = await officesController.create(createOfficeDto);
      expect(result).toEqual(createOfficeDto);
    });
  });
});
