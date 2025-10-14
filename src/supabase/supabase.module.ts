import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService, SupabaseAuthGuard],
  exports: [SupabaseService, SupabaseAuthGuard],
})
export class SupabaseModule {}
