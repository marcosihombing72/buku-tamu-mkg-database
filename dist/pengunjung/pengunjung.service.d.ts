import { SupabaseService } from '@/supabase/supabase.service';
import 'dayjs/locale/id';
import { IsiBukuTamuDto } from '@/pengunjung/dto/create-buku-tamu.dto';
export declare class PengunjungService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getAllStasiun(): Promise<{
        message: string;
        data: any[];
    }>;
    getJumlahPengunjung(id_stasiun: string): Promise<{
        message: string;
        hariIni: number;
        mingguIni: number;
        bulanIni: number;
    }>;
    isiBukuTamu(dto: IsiBukuTamuDto, file: Express.Multer.File): Promise<{
        message: string;
        data: {
            waktu_kunjungan: string;
            tanda_tangan_url: string;
            tujuan: string;
            id_stasiun: string;
            Nama_Depan_Pengunjung: string;
            Nama_Belakang_Pengunjung?: string;
            Email_Pengunjung: string;
            No_Telepon_Pengunjung: string;
            Asal_Pengunjung: import("@/pengunjung/dto/create-buku-tamu.dto").AsalPengunjung;
            Asal_Instansi?: string;
            Alamat_Lengkap: string;
            tanda_tangan: any;
        };
    }>;
}
