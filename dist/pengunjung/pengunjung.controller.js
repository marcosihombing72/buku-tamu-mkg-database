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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PengunjungController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const create_buku_tamu_dto_1 = require("./dto/create-buku-tamu.dto");
const pengunjung_service_1 = require("./pengunjung.service");
let PengunjungController = class PengunjungController {
    pengunjungService;
    constructor(pengunjungService) {
        this.pengunjungService = pengunjungService;
    }
    async getAllStasiun() {
        return this.pengunjungService.getAllStasiun();
    }
    async getJumlahPengunjung(id_stasiun) {
        if (!id_stasiun) {
            throw new common_1.BadRequestException('Parameter id_stasiun harus disertakan');
        }
        return this.pengunjungService.getJumlahPengunjung(id_stasiun);
    }
    async isiBukuTamu(dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('File tanda tangan harus disertakan');
        }
        return this.pengunjungService.isiBukuTamu(dto, file);
    }
};
exports.PengunjungController = PengunjungController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PengunjungController.prototype, "getAllStasiun", null);
__decorate([
    (0, common_1.Get)('jumlah'),
    (0, swagger_1.ApiQuery)({
        name: 'id_stasiun',
        required: true,
        description: 'ID stasiun untuk menghitung jumlah pengunjung',
        example: '5b2df30a-4204-470a-bfff-da645ed475d4',
    }),
    __param(0, (0, common_1.Query)('id_stasiun')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PengunjungController.prototype, "getJumlahPengunjung", null);
__decorate([
    (0, common_1.Post)('isi-buku-tamu'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Data pengunjung dan file tanda tangan',
        type: create_buku_tamu_dto_1.IsiBukuTamuDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('tanda_tangan')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_buku_tamu_dto_1.IsiBukuTamuDto, Object]),
    __metadata("design:returntype", Promise)
], PengunjungController.prototype, "isiBukuTamu", null);
exports.PengunjungController = PengunjungController = __decorate([
    (0, swagger_1.ApiTags)('Pengunjung'),
    (0, common_1.Controller)('pengunjung'),
    __metadata("design:paramtypes", [pengunjung_service_1.PengunjungService])
], PengunjungController);
//# sourceMappingURL=pengunjung.controller.js.map