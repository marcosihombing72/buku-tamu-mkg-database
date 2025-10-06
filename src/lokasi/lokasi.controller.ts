import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { CreateLokasiDto } from '@/lokasi/dto/create-lokasi.dto';
import { UpdateLokasiDto } from '@/lokasi/dto/update-lokasi.dto';
import { LokasiService } from '@/lokasi/lokasi.service';

@Controller('lokasi')
export class LokasiController {
  constructor(private readonly lokasiService: LokasiService) {}

  @Get()
  @ApiQuery({
    name: 'nama',
    required: false,
    type: String,
    description: 'Filter lokasi berdasarkan nama (opsional)',
  })
  @ApiQuery({
    name: 'latitude',
    required: false,
    type: Number,
    description: 'Filter lokasi berdasarkan latitude (opsional)',
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
    type: Number,
    description: 'Filter lokasi berdasarkan longitude (opsional)',
  })
  async getAllLokasi(
    @Query('nama') nama?: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
  ) {
    return this.lokasiService.getAllLokasi({
      nama,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    });
  }

  @Post('create')
  async createLokasi(@Body() dto: CreateLokasiDto) {
    return this.lokasiService.createLokasi(dto);
  }

  @Put('update')
  async updateLokasi(@Query('id') id: string, @Body() dto: UpdateLokasiDto) {
    return this.lokasiService.updateLokasi(id, dto);
  }
}
