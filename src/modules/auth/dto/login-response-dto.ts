import { ApiProperty } from '@nestjs/swagger';
import { ExcludeUserResponseDto } from './exclude-user-response-dto';

export class LoginResponseDto extends ExcludeUserResponseDto {
  @ApiProperty({
    description: 'The access token for the user.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for the user.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}
