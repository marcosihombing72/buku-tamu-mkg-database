import { AdminModule } from '@/admin/admin.module';
import { LokasiModule } from '@/lokasi/lokasi.module';
import { PengunjungModule } from '@/pengunjung/pengunjung.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { SupabaseService } from '@/supabase/supabase.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    PengunjungModule,
    LokasiModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
