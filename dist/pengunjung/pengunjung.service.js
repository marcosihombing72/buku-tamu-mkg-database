"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PengunjungService = void 0;
const supabase_service_1 = require("../supabase/supabase.service");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/id");
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.locale('id');
let PengunjungService = class PengunjungService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getAllStasiun() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.from('Stasiun').select('*');
        if (error) {
            throw new common_1.BadRequestException(`Gagal ambil data stasiun: ${error.message}`);
        }
        return { message: 'Stasiun data retrieved successfully', data };
    }
    async getJumlahPengunjung(id_stasiun) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('Buku_Tamu')
            .select('Waktu_Kunjungan')
            .eq('ID_Stasiun', id_stasiun);
        if (error) {
            throw new common_1.BadRequestException(`Gagal ambil data pengunjung: ${error.message}`);
        }
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        let hariIni = 0;
        let mingguIni = 0;
        let bulanIni = 0;
        for (const item of data ?? []) {
            const waktu = new Date(item.Waktu_Kunjungan);
            if (waktu.getTime() >= startOfDay.getTime())
                hariIni++;
            if (waktu.getTime() >= startOfWeek.getTime())
                mingguIni++;
            if (waktu.getTime() >= startOfMonth.getTime())
                bulanIni++;
        }
        return {
            message: 'Jumlah pengunjung berhasil dihitung',
            hariIni,
            mingguIni,
            bulanIni,
        };
    }
    async isiBukuTamu(dto, file) {
        const supabase = this.supabaseService.getClient();
        if (!file) {
            throw new common_1.BadRequestException('File tanda tangan harus disertakan');
        }
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Format tanda tangan tidak valid, hanya PNG/JPG/JPEG');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
        }
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('tanda-tangan')
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (uploadError) {
            throw new common_1.BadRequestException(`Gagal upload tanda tangan: ${uploadError.message}`);
        }
        const { data: { publicUrl }, } = supabase.storage.from('tanda-tangan').getPublicUrl(fileName);
        const { error: insertError } = await supabase.from('Buku_Tamu').insert({
            Tujuan: dto.tujuan,
            ID_Stasiun: dto.id_stasiun,
            Nama_Depan_Pengunjung: dto.Nama_Depan_Pengunjung,
            Nama_Belakang_Pengunjung: dto.Nama_Belakang_Pengunjung || null,
            Email_Pengunjung: dto.Email_Pengunjung,
            No_Telepon_Pengunjung: dto.No_Telepon_Pengunjung,
            Asal_Pengunjung: dto.Asal_Pengunjung,
            Asal_Instansi: dto.Asal_Instansi || null,
            Alamat_Lengkap: dto.Alamat_Lengkap,
            Tanda_Tangan: publicUrl,
        });
        if (insertError) {
            throw new common_1.BadRequestException(`Gagal simpan ke Buku_Tamu: ${insertError.message}`);
        }
        return {
            message: 'Data buku tamu berhasil disimpan',
            data: {
                ...dto,
                waktu_kunjungan: (0, dayjs_1.default)().format('dddd, D MMMM YYYY, HH.mm'),
                tanda_tangan_url: publicUrl,
            },
        };
    }
};
exports.PengunjungService = PengunjungService;
exports.PengunjungService = PengunjungService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PengunjungService);
//# sourceMappingURL=pengunjung.service.js.map