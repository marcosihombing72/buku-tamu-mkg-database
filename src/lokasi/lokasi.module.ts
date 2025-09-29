import { Module } from '@nestjs/common';
import { LokasiController } from './lokasi.controller';
import { LokasiService } from './lokasi.service';

@Module({
  controllers: [LokasiController],
  providers: [LokasiService]
})
export class LokasiModule {}
