import { Test } from '@nestjs/testing';
import {DoctorsController} from './doctors.controller'
import  {DoctorsService} from './doctors.service'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);
describe('DoctorsController', () => {
  let doctorsController: DoctorsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DoctorsController],
    }) .useMocker((token) => {
        if (token === DoctorsService) {
        
          return {
          }
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

    doctorsController = moduleRef.get<DoctorsController>(DoctorsController);
  });

  it('should be defined', () => {
    expect(doctorsController).toBeDefined();
  });
});