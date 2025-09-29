import { LokasiController } from '@/lokasi/lokasi.controller';
import { LokasiService } from '@/lokasi/lokasi.service';

import { SupabaseModule } from '@/supabase/supabase.module';
import { Module } from '@nestjs/common';

//*** Modul autentikasi Semua ***
@Module({
  //*** Import modul Supabase ***
  imports: [SupabaseModule],
  //*** Daftarkan controller dan service Lokasi ***
  controllers: [LokasiController],
  //*** Daftarkan service Lokasi ***
  providers: [LokasiService],
})
export class LokasiModule {}
