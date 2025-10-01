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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const login_admin_dto_1 = require("./dto/login-admin.dto");
const reset_password_admin_dto_1 = require("./dto/reset-password-admin.dto");
const update_profile_admin_dto_1 = require("./dto/update-profile-admin.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async loginAdmin(dto) {
        return this.adminService.loginAdmin(dto);
    }
    async resetPasswordAdmin(dto) {
        return this.adminService.resetPasswordAdmin(dto);
    }
    async getProfile(access_token, user_id) {
        return this.adminService.getProfile(user_id, access_token);
    }
    async updateProfile(dto, foto, access_token, user_id) {
        return this.adminService.updateProfile({
            ...dto,
            access_token,
            user_id,
        }, foto);
    }
    async getDashboard(access_token, user_id) {
        return this.adminService.getDashboard(access_token, user_id);
    }
    async getBukuTamu(access_token, user_id, period, startDate, endDate, filterStasiunId) {
        return this.adminService.getBukuTamu(access_token, user_id, period, startDate, endDate, filterStasiunId);
    }
    async getBukuTamuHariIni(authorization, user_id) {
        const access_token = authorization?.replace('Bearer ', '');
        return this.adminService.getBukuTamuHariIni(access_token, user_id);
    }
    async getBukuTamuMingguIni(authorization, user_id) {
        const access_token = authorization?.replace('Bearer ', '');
        return this.adminService.getBukuTamuMingguIni(access_token, user_id);
    }
    async getBukuTamuBulanIni(authorization, user_id) {
        const access_token = authorization?.replace('Bearer ', '');
        return this.adminService.getBukuTamuBulanIni(access_token, user_id);
    }
    async getAllAdmins(access_token, user_id, search, filterPeran, filterStasiunId) {
        return this.adminService.getAllAdmins(access_token, user_id, search, filterPeran, filterStasiunId);
    }
    async createAdmin(dto, foto, access_token, user_id) {
        return this.adminService.createAdmin(dto, foto, access_token, user_id);
    }
    async updateAdmin(dto, foto, access_token, user_id, id_admin) {
        return this.adminService.updateAdmin(user_id, {
            ...dto,
            foto,
        }, access_token, user_id);
    }
    async deleteAdmin(access_token, user_id, id_admin) {
        return this.adminService.deleteAdmin(access_token, user_id, id_admin);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_admin_dto_1.LoginAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_admin_dto_1.ResetPasswordAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPasswordAdmin", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: update_profile_admin_dto_1.UpdateProfileAdminDto }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                nama_depan: { type: 'string' },
                nama_belakang: { type: 'string' },
                password: { type: 'string' },
                foto: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.Put)('update-profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Headers)('access_token')),
    __param(3, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_admin_dto_1.UpdateProfileAdminDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('buku-tamu'),
    (0, swagger_1.ApiHeader)({ name: 'access_token', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['today', 'week', 'month'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filterStasiunId', required: false }),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Query)('period')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('filterStasiunId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamu", null);
__decorate([
    (0, common_1.Get)('buku-tamu/hari-ini'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamuHariIni", null);
__decorate([
    (0, common_1.Get)('buku-tamu/minggu-ini'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamuMingguIni", null);
__decorate([
    (0, common_1.Get)('buku-tamu/bulan-ini'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamuBulanIni", null);
__decorate([
    (0, common_1.Get)('all-admins'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filterPeran', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filterStasiunId', required: false }),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('filterPeran')),
    __param(4, (0, common_1.Query)('filterStasiunId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAdmins", null);
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                nama_depan: { type: 'string' },
                nama_belakang: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                confirmPassword: { type: 'string' },
                peran: { type: 'string' },
                id_stasiun: { type: 'string' },
                foto: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.Post)('create-admin'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Headers)('access_token')),
    __param(3, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: update_profile_admin_dto_1.UpdateProfileAdminDto }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                nama_depan: { type: 'string' },
                nama_belakang: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                confirmPassword: { type: 'string' },
                foto: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.Put)('update-admin'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Headers)('access_token')),
    __param(3, (0, common_1.Headers)('user_id')),
    __param(4, (0, common_1.Param)('id_admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_admin_dto_1.UpdateProfileAdminDto, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)('delete-admin/:id_admin'),
    (0, swagger_1.ApiHeader)({
        name: 'access_token',
        description: 'your-access_token',
        required: true,
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Headers)('access_token')),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Param)('id_admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map