import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private anonClient: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const anonKey = this.configService.get<string>('SUPABASE_KEY');
    const serviceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!url || !anonKey || !serviceRoleKey) {
      throw new Error(
        'SUPABASE_URL, SUPABASE_KEY, dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env',
      );
    }

    // Client untuk operasi normal (query, insert, dll)
    this.anonClient = createClient(url, anonKey);

    // Client untuk operasi admin (update password, delete user, dll)
    this.adminClient = createClient(url, serviceRoleKey);
  }

  getClient(): SupabaseClient {
    return this.anonClient;
  }

  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }
}
