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
const login_admin_dto_1 = require("./dto/login-admin.dto");
const reset_password_admin_dto_1 = require("./dto/reset-password-admin.dto");
const update_profile_admin_dto_1 = require("./dto/update-profile-admin.dto");
const supabase_auth_guard_1 = require("../supabase/supabase-auth.guard");
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
    async getProfile(req, user_id) {
        const user = req.user;
        return this.adminService.getProfile(user_id);
    }
    async updateProfile(req, user_id, dto, foto) {
        const user = req.user;
        return this.adminService.updateProfile(user, user_id, dto, foto);
    }
    async getBukuTamu(req, user_id, period, startDate, endDate, filterStasiunId) {
        const user = req.user;
        return this.adminService.getBukuTamu(user, user_id, period, startDate, endDate, filterStasiunId);
    }
    async getBukuTamuHariIni(req, user_id) {
        const user = req.user;
        return this.adminService.getBukuTamuHariIni(user, user_id);
    }
    async getBukuTamuMingguIni(req, user_id) {
        const user = req.user;
        return this.adminService.getBukuTamuMingguIni(user, user_id);
    }
    async getBukuTamuBulanIni(req, user_id) {
        const user = req.user;
        return this.adminService.getBukuTamuBulanIni(user, user_id);
    }
    async getAllAdmins(req, user_id, search, filterPeran, filterStasiunId) {
        const user = req.user;
        return this.adminService.getAllAdmins(user, user_id, search, filterPeran, filterStasiunId);
    }
    async updateAdmin(req, dto, foto, id_admin, user_id) {
        const user = req.user;
        return this.adminService.updateAdmin(user, id_admin, {
            ...dto,
            foto,
        }, user_id);
    }
    async deleteAdmin(req, user_id, id_admin) {
        const user = req.user;
        return this.adminService.deleteAdmin(user, user_id, id_admin);
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
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                nama_depan: { type: 'string', example: 'Rizal' },
                nama_belakang: { type: 'string', example: 'Ramadhan' },
                password: { type: 'string', example: 'newpassword123' },
                confirmPassword: {
                    type: 'string',
                    example: 'newpassword123',
                },
                foto: {
                    type: 'string',
                    format: 'binary',
                    example: 'foto_admin.png',
                },
            },
        },
    }),
    (0, common_1.Put)('update-profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_profile_admin_dto_1.UpdateProfileAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Get)('buku-tamu'),
    (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['today', 'week', 'month'],
    }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filterStasiunId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Query)('period')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('filterStasiunId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamu", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Get)('buku-tamu/hari-ini'),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamuHariIni", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Get)('buku-tamu/minggu-ini'),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamuMingguIni", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Get)('buku-tamu/bulan-ini'),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBukuTamuBulanIni", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Get)('all-admins'),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filterPeran', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'filterStasiunId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('filterPeran')),
    __param(4, (0, common_1.Query)('filterStasiunId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAdmins", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: update_profile_admin_dto_1.UpdateProfileAdminDto }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                nama_depan: { type: 'string' },
                nama_belakang: { type: 'string' },
                password: { type: 'string' },
                confirmPassword: { type: 'string' },
                foto: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')),
    (0, common_1.Put)('update-admin'),
    (0, swagger_1.ApiHeader)({
        name: 'id_admin',
        description: 'ID Admin yang akan diperbarui (hanya Superadmin yang bisa ubah admin lain)',
        required: true,
        example: '788cb8a1-e20b-4dfb-990c-90dbbca67a96',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID superadmin',
        required: true,
        example: '69fe727f-17e3-4065-a16e-23efb26382cf',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Headers)('id_admin')),
    __param(4, (0, common_1.Headers)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_admin_dto_1.UpdateProfileAdminDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    (0, common_1.Delete)('delete-admin/:id_admin'),
    (0, swagger_1.ApiHeader)({
        name: 'user_id',
        description: 'ID user',
        required: true,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('user_id')),
    __param(2, (0, common_1.Param)('id_admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map