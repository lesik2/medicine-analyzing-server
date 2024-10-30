import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { PatientsModule } from './patients.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Patient } from './models/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Patients', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PatientsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: ':memory',
          entities: [Patient],
          synchronize: true,
        }),
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/POST patients`, async () => {
    const createPatientDto = {
      name: 'Алексей',
      surname: 'Пухальский',
      patronymic: 'Александрович',
      gender: 'male',
      ageCategory: 'ADULT',
      dateOfBirth: '1990-05-15',
    };

    const response = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto)
      .expect(201);

    const createdPatientId = response.body.id;

    expect(response.body).toEqual(expect.objectContaining(createPatientDto));

    await request(app.getHttpServer()).delete(`/patients/${createdPatientId}`);
  });

  it(`/DELETE patients/:id`, async () => {
    const createPatientDto = {
      name: 'Алексей',
      surname: 'Пухальский',
      patronymic: 'Александрович',
      gender: 'male',
      ageCategory: 'ADULT',
      dateOfBirth: '1990-05-15',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto)
      .expect(201);

    const createdPatientId = createResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/patients/${createdPatientId}`)
      .expect(200);

    const deletedPatient = await request(app.getHttpServer()).get(
      `/patients/${createdPatientId}`,
    );
    expect(deletedPatient.status).toBe(404);
  });

  it(`/DELETE patients/:id - not found`, async () => {
    await request(app.getHttpServer())
      .delete(`/patients/non-existing-id`)
      .expect(404);
  });

  it(`/PUT patients`, async () => {
    const createPatientDto = {
      name: 'Алексей',
      surname: 'Пухальский',
      patronymic: 'Александрович',
      gender: 'male',
      ageCategory: 'ADULT',
      dateOfBirth: '1990-05-15',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto)
      .expect(201);

    const createdPatientId = createResponse.body.id;

    const updatePatientDto = {
      id: createdPatientId,
      name: 'Алексей',
      surname: 'Пухальский',
      patronymic: 'Александрович',
      gender: 'male',
      ageCategory: 'ADULT',
      dateOfBirth: '1990-05-15',
    };

    const response = await request(app.getHttpServer())
      .put('/patients')
      .send(updatePatientDto)
      .expect(200);

    expect(response.body.affected).toBe(1);

    await request(app.getHttpServer()).delete(`/patients/${createdPatientId}`);
  });

  it(`/GET patients`, async () => {
    const createPatientDto = {
      name: 'Алексей',
      surname: 'Пухальский',
      patronymic: 'Александрович',
      gender: 'male',
      ageCategory: 'ADULT',
      dateOfBirth: '1990-05-15',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/patients')
      .send(createPatientDto)
      .expect(201);

    const createdPatientId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/patients`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdPatientId,
          fullName: 'Пухальский Алексей Александрович',
          active: true,
          dateOfBirth: '1990-05-15',
        }),
      ]),
    );

    await request(app.getHttpServer()).delete(`/patients/${createdPatientId}`);
  });
});
