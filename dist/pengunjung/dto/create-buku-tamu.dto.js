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
exports.IsiBukuTamuDto = exports.AsalPengunjung = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AsalPengunjung;
(function (AsalPengunjung) {
    AsalPengunjung["BMKG"] = "BMKG";
    AsalPengunjung["Pemerintah_Pusat_atau_Pemerintah_Daerah"] = "Pemerintah Pusat/Pemerintah Daerah";
    AsalPengunjung["Umum"] = "Umum";
    AsalPengunjung["Universitas"] = "Universitas";
})(AsalPengunjung || (exports.AsalPengunjung = AsalPengunjung = {}));
class IsiBukuTamuDto {
    tujuan;
    id_stasiun;
    Nama_Depan_Pengunjung;
    Nama_Belakang_Pengunjung;
    Email_Pengunjung;
    No_Telepon_Pengunjung;
    Asal_Pengunjung;
    Asal_Instansi;
    waktu_kunjungan;
    Alamat_Lengkap;
    tanda_tangan;
}
exports.IsiBukuTamuDto = IsiBukuTamuDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tujuan kunjungan pengunjung',
        example: 'Rapat koordinasi',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "tujuan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID stasiun',
        example: '5b2df30a-4204-470a-bfff-da645ed475d4',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "id_stasiun", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ahmad' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "Nama_Depan_Pengunjung", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hidayat', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "Nama_Belakang_Pengunjung", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ahmad@example.com' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "Email_Pengunjung", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08123456789' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "No_Telepon_Pengunjung", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asal pengunjung',
        enum: AsalPengunjung,
        enumName: 'AsalPengunjung',
        example: AsalPengunjung.BMKG,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(AsalPengunjung),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "Asal_Pengunjung", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dishub' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "Asal_Instansi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senin, 10 Juni 2024, 14.30' }),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "waktu_kunjungan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Merdeka No. 10, Bandung' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IsiBukuTamuDto.prototype, "Alamat_Lengkap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'File tanda tangan (PNG/JPG)',
    }),
    __metadata("design:type", Object)
], IsiBukuTamuDto.prototype, "tanda_tangan", void 0);
//# sourceMappingURL=create-buku-tamu.dto.js.map