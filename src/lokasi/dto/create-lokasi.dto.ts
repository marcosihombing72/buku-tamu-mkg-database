import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLokasiDto {
  @ApiProperty({
    example: 'Stasiun Meteorologi Bengkulu',
    description: 'Nama lokasi',
  })
  @IsString()
  @IsNotEmpty()
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
