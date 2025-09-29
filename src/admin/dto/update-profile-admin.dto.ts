import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileAdminDto {
  @ApiProperty({ example: 'your-access_token', required: false })
  @IsOptional()
  @IsString()
  access_token?: string;

  @ApiProperty({
    example: '69fe727f-17e3-4065-a16e-23efb26382cf',
    required: false,
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty({ example: 'Nama depan admin', required: false })
  @IsOptional()
  @IsString()
  nama_depan?: string;

  @ApiProperty({ example: 'Nama belakang admin', required: false })
  @IsOptional()
  @IsString()
  nama_belakang?: string;

  @ApiProperty({ example: 'Password baru admin', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'foto (PNG/JPG)',
    required: false,
  })
  foto: any;
}
