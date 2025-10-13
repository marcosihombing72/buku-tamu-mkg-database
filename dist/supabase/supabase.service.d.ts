import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private readonly configService;
    private anonClient;
    private adminClient;
    private supabaseUrl;
    private anonKey;
    private serviceRoleKey;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    getClientWithAccessToken(accessToken: string): SupabaseClient;
    getAdminClient(): SupabaseClient;
}
