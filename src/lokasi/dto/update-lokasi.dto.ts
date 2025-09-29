import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLokasiDto {
  @ApiProperty({
    example: 'Stasiun Meteorologi Bengkulu',
    description: 'Nama lokasi',
  })
  @IsString()
  @IsOptional()
  nama: string;

  @ApiProperty({
    example: -3.795555,
    description: 'Latitude lokasi dalam format desimal',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: 102.259167,
    description: 'Longitude lokasi dalam format desimal',
  })
  @IsNumber()
  longitude: number;
}
