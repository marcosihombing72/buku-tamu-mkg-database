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
exports.UpdateLokasiDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateLokasiDto {
    nama;
    latitude;
    longitude;
}
exports.UpdateLokasiDto = UpdateLokasiDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Stasiun Meteorologi Bengkulu',
        description: 'Nama lokasi',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateLokasiDto.prototype, "nama", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: -3.795555,
        description: 'Latitude lokasi dalam format desimal',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLokasiDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 102.259167,
        description: 'Longitude lokasi dalam format desimal',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLokasiDto.prototype, "longitude", void 0);
//# sourceMappingURL=update-lokasi.dto.js.map