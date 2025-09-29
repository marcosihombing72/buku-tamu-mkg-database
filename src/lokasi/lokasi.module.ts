import { LokasiController } from '@/lokasi/lokasi.controller';
import { LokasiService } from '@/lokasi/lokasi.service';

import { SupabaseModule } from '@/supabase/supabase.module';
import { Module } from '@nestjs/common';

//*** Modul autentikasi Semua ***
@Module({
  //*** Import modul Supabase ***
  imports: [SupabaseModule],
  //*** Controller dan Service untuk Lokasi ***
  controllers: [LokasiController],
  //*** Provider untuk LokasiService ***
  providers: [LokasiService],
})
export class LokasiModule {}
