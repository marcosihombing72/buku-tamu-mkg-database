import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from '@/admin/admin.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PengunjungModule } from '@/pengunjung/pengunjung.module';
import { SupabaseService } from '@/supabase/supabase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    PengunjungModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
