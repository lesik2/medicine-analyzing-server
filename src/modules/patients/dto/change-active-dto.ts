import { IsUUID } from 'class-validator';

export class ChangeActiveDto {
  @IsUUID('all')
  id: string;
}
