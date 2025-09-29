import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateLokasiDto } from '@/lokasi/dto/create-lokasi.dto';
import { UpdateLokasiDto } from '@/lokasi/dto/update-lokasi.dto';
import { LokasiService } from '@/lokasi/lokasi.service';

@Controller('lokasi')
export class LokasiController {
  constructor(private readonly lokasiService: LokasiService) {}

  @ApiTags('Lokasi')
  @Get('lokasi')
  async getAllLokasi() {
    return this.lokasiService.getAllLokasi();
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
