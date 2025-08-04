import { Request } from 'express';
import { IsiBukuTamuDto } from './dto/isi-buku-tamu.dto';
import { SearchPengunjungDto } from './dto/search-pengunjung.dto';
import { PengunjungService } from './pengunjung.service';
export declare class PengunjungController {
    private readonly pengunjungService;
    constructor(pengunjungService: PengunjungService);
    getAll(): {
        value: string;
        label: string;
    }[];
    getAllStasiun(): Promise<{
        message: string;
        data: {
            ID_Stasiun: any;
            Nama_Stasiun: any;
        }[];
    }>;
    getJumlahPengunjung(id_stasiun: string): Promise<{
        hariIni: number;
        mingguIni: number;
        bulanIni: number;
    }>;
    searchPengunjung(dto: SearchPengunjungDto): Promise<any[]>;
    isiBukuTamu(dto: IsiBukuTamuDto, req: Request, file?: Express.Multer.File): Promise<{
        message: string;
    }>;
}
