import { AdminController } from '@/admin/admin.controller';
import { AdminService } from '@/admin/admin.service';

import { SupabaseAuthGuard } from '@/supabase/supabase-auth.guard';
import { SupabaseModule } from '@/supabase/supabase.module';
import { Module } from '@nestjs/common';

//*** Modul autentikasi Semua ***
@Module({
  //*** Import modul Supabase ***
  imports: [SupabaseModule, SupabaseAuthGuard],
  //*** Controller dan Service untuk Admin ***
  controllers: [AdminController],
  //*** Provider untuk AdminService ***
  providers: [AdminService],
})
export class AdminModule {}
