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
exports.LokasiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_lokasi_dto_1 = require("./dto/create-lokasi.dto");
const update_lokasi_dto_1 = require("./dto/update-lokasi.dto");
const lokasi_service_1 = require("./lokasi.service");
let LokasiController = class LokasiController {
    lokasiService;
    constructor(lokasiService) {
        this.lokasiService = lokasiService;
    }
    async getAllLokasi(nama, latitude, longitude) {
        return this.lokasiService.getAllLokasi({
            nama,
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
        });
    }
    async createLokasi(dto) {
        return this.lokasiService.createLokasi(dto);
    }
    async updateLokasi(id, dto) {
        return this.lokasiService.updateLokasi(id, dto);
    }
};
exports.LokasiController = LokasiController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'nama',
        required: false,
        type: String,
        description: 'Filter lokasi berdasarkan nama (opsional)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'latitude',
        required: false,
        type: Number,
        description: 'Filter lokasi berdasarkan latitude (opsional)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'longitude',
        required: false,
        type: Number,
        description: 'Filter lokasi berdasarkan longitude (opsional)',
    }),
    __param(0, (0, common_1.Query)('nama')),
    __param(1, (0, common_1.Query)('latitude')),
    __param(2, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], LokasiController.prototype, "getAllLokasi", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lokasi_dto_1.CreateLokasiDto]),
    __metadata("design:returntype", Promise)
], LokasiController.prototype, "createLokasi", null);
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lokasi_dto_1.UpdateLokasiDto]),
    __metadata("design:returntype", Promise)
], LokasiController.prototype, "updateLokasi", null);
exports.LokasiController = LokasiController = __decorate([
    (0, common_1.Controller)('lokasi'),
    __metadata("design:paramtypes", [lokasi_service_1.LokasiService])
], LokasiController);
//# sourceMappingURL=lokasi.controller.js.map