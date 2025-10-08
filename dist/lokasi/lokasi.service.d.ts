import { SupabaseService } from '@/supabase/supabase.service';
import { CreateLokasiDto } from '@/lokasi/dto/create-lokasi.dto';
import { UpdateLokasiDto } from '@/lokasi/dto/update-lokasi.dto';
export declare class LokasiService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getAllLokasi(filters?: {
        latitude?: number;
        longitude?: number;
        nama?: string;
    }): Promise<{
        message: string;
        data: any[];
    }>;
    createLokasi(dto: CreateLokasiDto): Promise<{
        message: string;
        data: null;
    }>;
    updateLokasi(id: string, dto: UpdateLokasiDto): Promise<{
        message: string;
        data: null;
    }>;
}
