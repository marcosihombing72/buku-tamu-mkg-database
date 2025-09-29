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
exports.UpdateProfileAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateProfileAdminDto {
    nama_depan;
    nama_belakang;
    password;
    foto;
}
exports.UpdateProfileAdminDto = UpdateProfileAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nama depan admin', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileAdminDto.prototype, "nama_depan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nama belakang admin', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileAdminDto.prototype, "nama_belakang", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password baru admin', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        example: 'foto (PNG/JPG)',
        required: false,
    }),
    __metadata("design:type", Object)
], UpdateProfileAdminDto.prototype, "foto", void 0);
//# sourceMappingURL=update-profile-admin.dto.js.map