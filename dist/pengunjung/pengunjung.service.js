"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PengunjungService = exports.AsalPengunjung = void 0;
const axios_1 = require("axios");
const API_BASE_URL = 'https://emsifa.github.io/api-wilayah-indonesia/api';
const supabase_client_1 = require("../supabase/supabase.client");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const uuid_1 = require("uuid");
var AsalPengunjung;
(function (AsalPengunjung) {
    AsalPengunjung["BMKG"] = "BMKG";
    AsalPengunjung["Pemerintah_Pusat_atau_Pemerintah_Daerah"] = "Pemerintah Pusat/Pemerintah Daerah";
    AsalPengunjung["Umum"] = "Umum";
    AsalPengunjung["Universitas"] = "Universitas";
})(AsalPengunjung || (exports.AsalPengunjung = AsalPengunjung = {}));
let PengunjungService = class PengunjungService {
    wilayahApi = axios_1.default.create({
        baseURL: API_BASE_URL,
    });
    getAllAsalPengunjung() {
        return Object.entries(AsalPengunjung).map(([key, value]) => ({
            value,
            label: value,
        }));
    }
    async getAllStasiun() {
        const { data, error } = await supabase_client_1.supabase
            .from('Stasiun')
            .select('ID_Stasiun, Nama_Stasiun')
            .order('Nama_Stasiun', { ascending: true });
        if (error) {
            console.error('Error fetching stasiun:', error);
            throw new Error('Failed to retrieve stasiun data');
        }
        return {
            message: 'Stasiun data retrieved successfully',
            data: data || [],
        };
    }
    async getJumlahPengunjung(id_stasiun) {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        try {
            const queries = [
                supabase_client_1.supabase
                    .from('Buku_Tamu')
                    .select('*', { count: 'exact', head: true })
                    .gte('Tanggal_Pengisian', startOfDay.toISOString())
                    .eq('ID_Stasiun', id_stasiun),
                supabase_client_1.supabase
                    .from('Buku_Tamu')
                    .select('*', { count: 'exact', head: true })
                    .gte('Tanggal_Pengisian', startOfWeek.toISOString())
                    .eq('ID_Stasiun', id_stasiun),
                supabase_client_1.supabase
                    .from('Buku_Tamu')
                    .select('*', { count: 'exact', head: true })
                    .gte('Tanggal_Pengisian', startOfMonth.toISOString())
                    .eq('ID_Stasiun', id_stasiun),
            ];
            const [hariIni, mingguIni, bulanIni] = await Promise.all(queries);
            if (hariIni.error || mingguIni.error || bulanIni.error) {
                console.error('Error fetching statistics:', {
                    hariIniError: hariIni.error,
                    mingguIniError: mingguIni.error,
                    bulanIniError: bulanIni.error,
                });
                throw new common_1.BadRequestException('Gagal mengambil data statistik pengunjung');
            }
            return {
                hariIni: hariIni.count || 0,
                mingguIni: mingguIni.count || 0,
                bulanIni: bulanIni.count || 0,
            };
        }
        catch (error) {
            console.error('Unexpected error in getJumlahPengunjung:', error);
            throw new common_1.BadRequestException('Terjadi kesalahan saat memproses permintaan');
        }
    }
    async isiBukuTamu(dto, ip, userAgent, file) {
        const { tujuan, id_stasiun, Nama_Depan_Pengunjung, Nama_Belakang_Pengunjung, Email_Pengunjung, No_Telepon_Pengunjung, Asal_Pengunjung, Asal_Instansi, Alamat_Lengkap, waktu_kunjungan, } = dto;
        if (!tujuan ||
            !id_stasiun ||
            !Nama_Depan_Pengunjung ||
            !Nama_Belakang_Pengunjung ||
            !Email_Pengunjung ||
            !No_Telepon_Pengunjung ||
            !Asal_Pengunjung ||
            !Alamat_Lengkap) {
            throw new common_1.BadRequestException('Semua data wajib diisi');
        }
        let fileUrl = null;
        if (file) {
            const path = `tanda-tangan/${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
            const { error: uploadError } = await supabase_client_1.supabase.storage
                .from('tanda-tangan')
                .upload(path, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false,
            });
            if (uploadError)
                throw new common_1.BadRequestException('Gagal mengunggah tanda tangan');
            const urlData = supabase_client_1.supabase.storage.from('tanda-tangan').getPublicUrl(path);
            fileUrl = urlData.data?.publicUrl;
            if (!fileUrl)
                throw new common_1.BadRequestException('Gagal mendapatkan URL tanda tangan');
        }
        const { data: stasiunData, error: stasiunError } = await supabase_client_1.supabase
            .from('Stasiun')
            .select('ID_Stasiun, Nama_Stasiun')
            .eq('ID_Stasiun', id_stasiun)
            .single();
        const typedStasiunData = stasiunData;
        if (stasiunError || !typedStasiunData) {
            throw new common_1.BadRequestException('ID Stasiun tidak ditemukan');
        }
        const waktuKunjungan = waktu_kunjungan || this.formatWaktuKunjungan();
        const { data: existingPengunjung, error } = await supabase_client_1.supabase
            .from('Pengunjung')
            .select('ID_Pengunjung')
            .match({
            Nama_Depan_Pengunjung,
            Nama_Belakang_Pengunjung,
            Email_Pengunjung,
            No_Telepon_Pengunjung,
            Asal_Pengunjung,
            Alamat_Lengkap,
        })
            .single();
        if (error && error.code !== 'PGRST116') {
            throw new common_1.BadRequestException('Gagal mengecek data pengunjung');
        }
        let pengunjungId;
        try {
            const { data: pengunjungList, error } = await supabase_client_1.supabase
                .from('Pengunjung')
                .select('ID_Pengunjung')
                .eq('Email_Pengunjung', Email_Pengunjung)
                .eq('No_Telepon_Pengunjung', No_Telepon_Pengunjung);
            if (error) {
                console.error('Error saat cek pengunjung:', error);
                throw new common_1.BadRequestException('Gagal mengecek data pengunjung');
            }
            const existingPengunjung = pengunjungList?.[0];
            if (existingPengunjung?.ID_Pengunjung) {
                pengunjungId = existingPengunjung.ID_Pengunjung;
            }
            else {
                pengunjungId = (0, uuid_1.v4)();
                const { error: pengunjungError } = await supabase_client_1.supabase
                    .from('Pengunjung')
                    .insert({
                    ID_Pengunjung: pengunjungId,
                    Nama_Depan_Pengunjung,
                    Nama_Belakang_Pengunjung,
                    Email_Pengunjung,
                    No_Telepon_Pengunjung,
                    Asal_Pengunjung,
                    Asal_Instansi,
                    Alamat_Lengkap,
                });
                if (pengunjungError) {
                    console.error('Error saat insert pengunjung:', pengunjungError);
                    throw new common_1.BadRequestException('Gagal menyimpan data pengunjung');
                }
            }
        }
        catch (err) {
            console.error('Unexpected error saat validasi pengunjung:', err);
            throw new common_1.BadRequestException('Gagal mengecek data pengunjung');
        }
        const { error: insertBukuTamuError } = await supabase_client_1.supabase
            .from('Buku_Tamu')
            .insert({
            ID_Pengunjung: pengunjungId,
            ID_Stasiun: id_stasiun,
            Tujuan: tujuan,
            Tanda_Tangan: fileUrl,
            Waktu_Kunjungan: waktuKunjungan,
        });
        if (insertBukuTamuError) {
            throw new common_1.BadRequestException('Gagal menyimpan data buku tamu');
        }
        const stasiunNama = typedStasiunData?.Nama_Stasiun || 'Stasiun Tidak Diketahui';
        const namaLengkap = `${Nama_Depan_Pengunjung} ${Nama_Belakang_Pengunjung}`;
        await supabase_client_1.supabase.from('Activity_Log').insert({
            ID_User: pengunjungId,
            Role: 'Pengunjung',
            Action: 'Isi Buku Tamu',
            Description: `Pengunjung dengan ID ${pengunjungId} dan nama ${namaLengkap} mengisi buku tamu ke stasiun ${stasiunNama}.`,
            IP_Address: ip,
            User_Agent: userAgent,
        });
        return { message: 'Data buku tamu berhasil disimpan' };
    }
    formatWaktuKunjungan() {
        const now = new Date();
        const optionsDate = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
        };
        const hariTanggal = now.toLocaleDateString('id-ID', optionsDate);
        const jam = now.toLocaleTimeString('id-ID', optionsTime);
        return `${hariTanggal}, ${jam}`;
    }
    async searchPengunjung(dto) {
        const { keyword } = dto;
        const { data: depan, error: errorDepan } = await supabase_client_1.supabase
            .from('Pengunjung')
            .select('*')
            .ilike('Nama_Depan_Pengunjung', `%${keyword}%`);
        const { data: belakang, error: errorBelakang } = await supabase_client_1.supabase
            .from('Pengunjung')
            .select('*')
            .ilike('Nama_Belakang_Pengunjung', `%${keyword}%`);
        if (errorDepan || errorBelakang) {
            console.error('Error search:', errorDepan || errorBelakang);
            throw new common_1.BadRequestException('Gagal mencari data pengunjung');
        }
        const combined = [...(depan || []), ...(belakang || [])];
        const unique = Array.from(new Map(combined.map((item) => [item.ID_Pengunjung, item])).values());
        return unique;
    }
};
exports.PengunjungService = PengunjungService;
exports.PengunjungService = PengunjungService = __decorate([
    (0, common_1.Injectable)()
], PengunjungService);
//# sourceMappingURL=pengunjung.service.js.map