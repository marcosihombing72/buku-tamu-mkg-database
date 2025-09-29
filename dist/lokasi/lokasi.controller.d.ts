import { CreateLokasiDto } from '@/lokasi/dto/create-lokasi.dto';
import { UpdateLokasiDto } from '@/lokasi/dto/update-lokasi.dto';
import { LokasiService } from '@/lokasi/lokasi.service';
export declare class LokasiController {
    private readonly lokasiService;
    constructor(lokasiService: LokasiService);
    getAllLokasi(): Promise<{
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
