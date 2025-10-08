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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokasiService = void 0;
const supabase_service_1 = require("../supabase/supabase.service");
const common_1 = require("@nestjs/common");
let LokasiService = class LokasiService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getAllLokasi(filters) {
        const supabase = this.supabaseService.getClient();
        let query = supabase.from('Lokasi').select('*');
        if (filters) {
            const { latitude, longitude, nama } = filters;
            if (latitude !== undefined) {
                query = query.eq('latitude', latitude);
            }
            if (longitude !== undefined) {
                query = query.eq('longitude', longitude);
            }
            if (nama) {
                query = query.ilike('nama', `%${nama}%`);
            }
        }
        const { data, error } = await query;
        if (error) {
            throw new common_1.BadRequestException(`Gagal ambil data lokasi: ${error.message}`);
        }
        return { message: 'Lokasi data retrieved successfully', data };
    }
    async createLokasi(dto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.from('Lokasi').insert({
            nama: dto.nama,
            latitude: dto.latitude,
            longitude: dto.longitude,
        });
        if (error) {
            throw new common_1.BadRequestException(`Gagal tambah data lokasi: ${error.message}`);
        }
        return { message: 'Lokasi added successfully', data };
    }
    async updateLokasi(id, dto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('Lokasi')
            .update({
            nama: dto.nama,
            latitude: dto.latitude,
            longitude: dto.longitude,
        })
            .eq('id', id);
        if (error) {
            throw new common_1.BadRequestException(`Gagal perbarui data lokasi: ${error.message}`);
        }
        return { message: 'Lokasi updated successfully', data };
    }
};
exports.LokasiService = LokasiService;
exports.LokasiService = LokasiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], LokasiService);
//# sourceMappingURL=lokasi.service.js.map