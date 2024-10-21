import { Module } from '@nestjs/common';
import configuration from '@config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from '../mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PatientsModule } from '../patients/patients.module';
import { User } from '../users/models/user.entity';
import { Doctor } from '../doctors/models/doctor.entity';
import { Patient } from '../patients/models/patient.entity';
import { Office } from '../offices/models/office.entity';
import { Analysis } from '../care-patient/models/analysis.entity';
import { CarePatient } from '../care-patient/models/care-patient.entity';
import { Conclusion } from '../care-patient/models/conclusion.entity';
import { Reception } from '../care-patient/models/reception.entity';
import { Appointment } from '../appointment/models/appointment.entity';
import { TimeTracking } from '../time-tracking/modules/time-tracking.entity';
import { OfficesModule } from '../offices/offices.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db_host'),
        port: +configService.get('db_port'),
        username: configService.get('db_username'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        entities: [
          User,
          Doctor,
          Patient,
          Office,
          Analysis,
          CarePatient,
          Conclusion,
          Reception,
          Appointment,
          TimeTracking,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: `smtps://${configService.get('mail_login')}:${configService.get('mail_password')}@smtp.gmail.com`,
        defaults: {
          from: `"Талон-Онлайн" <${configService.get('mail_login')}>`,
        },
        template: {
          dir: process.cwd() + '/src/templates',
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true,
          }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 1,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    UsersModule,
    AuthModule,
    MailModule,
    PatientsModule,
    OfficesModule,
    DoctorsModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
