import { IsiBukuTamuDto } from '@/pengunjung/dto/create-buku-tamu.dto';
import { PengunjungService } from '@/pengunjung/pengunjung.service';
export declare class PengunjungController {
    private readonly pengunjungService;
    constructor(pengunjungService: PengunjungService);
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
