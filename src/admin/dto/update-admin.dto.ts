import { PeranAdminEnum } from '@/admin/dto/create-admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ example: 'Budi', description: 'Nama depan admin' })
  @IsOptional()
  @IsString()
  nama_depan?: string;

  @ApiProperty({
    example: 'Santoso',
    description: 'Nama belakang admin',
  })
  @IsOptional()
  @IsString()
  nama_belakang?: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email admin',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password baru admin minimal 6 karakter',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Konfirmasi password admin',
  })
  @IsString()
  @IsOptional()
  confirmPassword: string;

  @ApiProperty({
    enum: PeranAdminEnum,
    example: PeranAdminEnum.ADMIN,
    description: 'Peran admin',
  })
  @IsOptional()
  @IsEnum(PeranAdminEnum)
  peran?: PeranAdminEnum;

  @ApiProperty({
    example: '123',
    description: 'ID stasiun (hanya untuk Admin, bukan Superadmin)',
  })
  @IsOptional()
  @IsString()
  id_stasiun?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Foto admin baru (opsional)',
  })
  @IsOptional()
  foto?: any;
}
