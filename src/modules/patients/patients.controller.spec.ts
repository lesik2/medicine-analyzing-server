import { Test } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { ExcludeUserPassword } from '../../types/excludeUserPassword';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AgeCategory, Gender, Roles } from '../../types/index';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessages } from '../../common/error-messages';
import * as moment from 'moment';
import { Patient } from './models/patient.entity';
import { CreatePatientDto } from './dto/create-patient-dto';
import { patientsProfile } from './constants';

const moduleMocker = new ModuleMocker(global);

describe('PatientsController', () => {
  let patientsController: PatientsController;
  let patientsService: PatientsService;
  let user: ExcludeUserPassword;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PatientsController],
    })
      .useMocker((token) => {

        const mockPatient = {
          id: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
          active: false,
          dateOfBirth: '1985-06-15',
          fullName: 'Иванов Иван Иванович',
        };
      
        const mockPatients = [
          mockPatient
        ];

        if (token === PatientsService) {
          return {
            findAllPattern: jest.fn().mockResolvedValue(patientsProfile),
            getAmountOfPatients: jest.fn((userId: string)=>2),
            create: jest.fn().mockResolvedValue(mockPatient),
            validatePatientAge: jest.fn(
              (dateOfBirth: string, ageCategory: AgeCategory) => {
                const birthDate = moment(dateOfBirth, moment.ISO_8601);
                const age = moment().diff(moment(birthDate), 'years');

                if (ageCategory === AgeCategory.CHILD && age > 18) {
                  throw new BadRequestException(
                    ErrorMessages.PATIENT_CHILD_OLDER_ERROR,
                  );
                }

                if (ageCategory === AgeCategory.ADULT && age < 18) {
                  throw new BadRequestException(
                    ErrorMessages.PATIENT_ADULT_YOUNGER_ERROR,
                  );
                }
              },
            ),
            findAll: jest.fn().mockResolvedValue(mockPatients),
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

    patientsService = moduleRef.get<PatientsService>(PatientsService);
    patientsController = moduleRef.get<PatientsController>(PatientsController);

    user = {
      id: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
      name: 'Иван',
      surname: 'Иванов',
      email: 'ivanov@example.com',
      isEmailConfirmed: true,
      refreshToken: null,
      role: Roles.USER,
      patients: [],
    };
  });

  it('should be defined', () => {
    expect(patientsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const expectedResult = [
        {
          id: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
          active: false,
          dateOfBirth: '1985-06-15',
          fullName: 'Иванов Иван Иванович',
        },
      ];

      const response = await patientsController.findAll(user);

      expect(response).toEqual(expectedResult);
      expect(patientsService.findAll).toHaveBeenCalledWith(user.id);
    });
  });

  describe('validatePatientAge', () => {
    it('should throw an error if a CHILD is older than 18', () => {
      const dateOfBirth = '2000-01-01';
      const ageCategory = AgeCategory.CHILD;

      expect(() => {
        patientsService.validatePatientAge(dateOfBirth, ageCategory);
      }).toThrow(
        new BadRequestException(ErrorMessages.PATIENT_CHILD_OLDER_ERROR),
      );
    });
    it('should throw an error if an ADULT is younger than 18', () => {
      const dateOfBirth = '2010-01-01';
      const ageCategory = AgeCategory.ADULT;

      expect(() => {
        patientsService.validatePatientAge(dateOfBirth, ageCategory);
      }).toThrow(
        new BadRequestException(ErrorMessages.PATIENT_ADULT_YOUNGER_ERROR),
      );
    });
    it('should not throw an error for a valid CHILD age', () => {
      const dateOfBirth = '2010-01-01';
      const ageCategory = AgeCategory.CHILD;

      expect(() => {
        patientsService.validatePatientAge(dateOfBirth, ageCategory);
      }).not.toThrow();
    });

    it('should not throw an error for a valid ADULT age', () => {
      const dateOfBirth = '1985-01-01';
      const ageCategory = AgeCategory.ADULT;

      expect(() => {
        patientsService.validatePatientAge(dateOfBirth, ageCategory);
      }).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new patient and return it', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'Алексей',
        surname: 'Пухальский',
        patronymic: 'Александрович',
        gender: Gender.MALE,
        ageCategory: AgeCategory.ADULT,
        dateOfBirth: '1990-05-15',
      };

      const expectedResult = {
        id: 'e5b33c5e-1b9f-4f73-9b5e-9b83e55a9c56',
        active: false,
        dateOfBirth: '1985-06-15',
        fullName: 'Иванов Иван Иванович',
      };


      const result = await patientsController.create(user, createPatientDto);
      expect(result).toEqual(expectedResult);
    });
  })
  describe('getAmountOfPatients', () => {
    it('should return amount of patients', async () => {
      const result = await patientsService.getAmountOfPatients(user.id);
      expect(result).toBe(2);
    });
  })

  describe('findAllPattern', ()=>{
    it('should return pattern of patients', async () => {
      const result = await patientsService.findAllPattern(user.id);
      expect(result).toBe(patientsProfile);
    });
  })
});
