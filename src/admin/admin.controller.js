"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var update_profile_admin_dto_1 = require("@/admin/dto/update-profile-admin.dto");
var supabase_auth_guard_1 = require("@/supabase/supabase-auth.guard");
var AdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin'), (0, common_1.Controller)('admin')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _loginAdmin_decorators;
    var _resetPasswordAdmin_decorators;
    var _getProfile_decorators;
    var _updateProfile_decorators;
    var _getBukuTamu_decorators;
    var _getBukuTamuHariIni_decorators;
    var _getBukuTamuMingguIni_decorators;
    var _getBukuTamuBulanIni_decorators;
    var _getAllAdmins_decorators;
    var _updateAdmin_decorators;
    var _deleteAdmin_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        AdminController_1.prototype.loginAdmin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.loginAdmin(dto)];
                });
            });
        };
        AdminController_1.prototype.resetPasswordAdmin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.adminService.resetPasswordAdmin(dto)];
                });
            });
        };
        AdminController_1.prototype.getProfile = function (req, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.getProfile(user_id)];
                });
            });
        };
        AdminController_1.prototype.updateProfile = function (req, user_id, dto, foto) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.updateProfile(user, user_id, dto, foto)];
                });
            });
        };
        AdminController_1.prototype.getBukuTamu = function (req, user_id, period, startDate, endDate, filterStasiunId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.getBukuTamu(user, user_id, period, startDate, endDate, filterStasiunId)];
                });
            });
        };
        AdminController_1.prototype.getBukuTamuHariIni = function (req, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.getBukuTamuHariIni(user, user_id)];
                });
            });
        };
        AdminController_1.prototype.getBukuTamuMingguIni = function (req, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.getBukuTamuMingguIni(user, user_id)];
                });
            });
        };
        AdminController_1.prototype.getBukuTamuBulanIni = function (req, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.getBukuTamuBulanIni(user, user_id)];
                });
            });
        };
        AdminController_1.prototype.getAllAdmins = function (req, user_id, search, filterPeran, filterStasiunId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.getAllAdmins(user, user_id, search, filterPeran, filterStasiunId)];
                });
            });
        };
        // @ApiConsumes('multipart/form-data')
        // @ApiBody({
        //   schema: {
        //     type: 'object',
        //     properties: {
        //       nama_depan: { type: 'string' },
        //       nama_belakang: { type: 'string' },
        //       email: { type: 'string' },
        //       password: { type: 'string' },
        //       confirmPassword: { type: 'string' },
        //       peran: { type: 'string' },
        //       id_stasiun: { type: 'string' },
        //       foto: { type: 'string', format: 'binary' },
        //     },
        //   },
        // })
        // @Post('create-admin')
        // @ApiHeader({
        //   name: 'access_token',
        //   description: 'your-access_token',
        //   required: true,
        // })
        // @ApiHeader({
        //   name: 'user_id',
        //   description: 'ID user',
        //   required: true,
        // })
        // @UseInterceptors(FileInterceptor('foto'))
        // async createAdmin(
        //   @Body() dto: CreateAdminDto,
        //   @UploadedFile() foto: Express.Multer.File,
        //   @Headers('access_token') access_token: string,
        //   @Headers('user_id') user_id: string,
        // ) {
        //   return this.adminService.createAdmin(dto, foto, user_id);
        // }
        AdminController_1.prototype.updateAdmin = function (req, dto, foto, id_admin, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.updateAdmin(user, id_admin, __assign(__assign({}, dto), { foto: foto }), user_id)];
                });
            });
        };
        AdminController_1.prototype.deleteAdmin = function (req, user_id, id_admin) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.adminService.deleteAdmin(user, user_id, id_admin)];
                });
            });
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _loginAdmin_decorators = [(0, common_1.Post)('login')];
        _resetPasswordAdmin_decorators = [(0, common_1.Post)('reset-password')];
        _getProfile_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }), (0, common_1.Get)('profile')];
        _updateProfile_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }), (0, swagger_1.ApiBody)({
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
            }), (0, common_1.Put)('update-profile'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto'))];
        _getBukuTamu_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, common_1.Get)('buku-tamu'), (0, swagger_1.ApiHeader)({ name: 'user_id', required: true }), (0, swagger_1.ApiQuery)({
                name: 'period',
                required: false,
                enum: ['today', 'week', 'month'],
            }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }), (0, swagger_1.ApiQuery)({ name: 'filterStasiunId', required: false })];
        _getBukuTamuHariIni_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, common_1.Get)('buku-tamu/hari-ini'), (0, swagger_1.ApiHeader)({
                name: 'user_id',
                description: 'ID user',
                required: true,
            })];
        _getBukuTamuMingguIni_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, common_1.Get)('buku-tamu/minggu-ini'), (0, swagger_1.ApiHeader)({
                name: 'user_id',
                description: 'ID user',
                required: true,
            })];
        _getBukuTamuBulanIni_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, common_1.Get)('buku-tamu/bulan-ini'), (0, swagger_1.ApiHeader)({
                name: 'user_id',
                description: 'ID user',
                required: true,
            })];
        _getAllAdmins_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, common_1.Get)('all-admins'), (0, swagger_1.ApiHeader)({
                name: 'user_id',
                description: 'ID user',
                required: true,
            }), (0, swagger_1.ApiQuery)({ name: 'search', required: false }), (0, swagger_1.ApiQuery)({ name: 'filterPeran', required: false }), (0, swagger_1.ApiQuery)({ name: 'filterStasiunId', required: false })];
        _updateAdmin_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({ type: update_profile_admin_dto_1.UpdateProfileAdminDto }), (0, swagger_1.ApiBody)({
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
            }), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto')), (0, common_1.Put)('update-admin'), (0, swagger_1.ApiHeader)({
                name: 'id_admin',
                description: 'ID Admin yang akan diperbarui (hanya Superadmin yang bisa ubah admin lain)',
                required: true,
                example: '788cb8a1-e20b-4dfb-990c-90dbbca67a96',
            }), (0, swagger_1.ApiHeader)({
                name: 'user_id',
                description: 'ID superadmin',
                required: true,
                example: '69fe727f-17e3-4065-a16e-23efb26382cf',
            })];
        _deleteAdmin_decorators = [(0, swagger_1.ApiBearerAuth)('access-token'), (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard), (0, common_1.Delete)('delete-admin/:id_admin'), (0, swagger_1.ApiHeader)({
                name: 'user_id',
                description: 'ID user',
                required: true,
            })];
        __esDecorate(_classThis, null, _loginAdmin_decorators, { kind: "method", name: "loginAdmin", static: false, private: false, access: { has: function (obj) { return "loginAdmin" in obj; }, get: function (obj) { return obj.loginAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPasswordAdmin_decorators, { kind: "method", name: "resetPasswordAdmin", static: false, private: false, access: { has: function (obj) { return "resetPasswordAdmin" in obj; }, get: function (obj) { return obj.resetPasswordAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: function (obj) { return "getProfile" in obj; }, get: function (obj) { return obj.getProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProfile_decorators, { kind: "method", name: "updateProfile", static: false, private: false, access: { has: function (obj) { return "updateProfile" in obj; }, get: function (obj) { return obj.updateProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBukuTamu_decorators, { kind: "method", name: "getBukuTamu", static: false, private: false, access: { has: function (obj) { return "getBukuTamu" in obj; }, get: function (obj) { return obj.getBukuTamu; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBukuTamuHariIni_decorators, { kind: "method", name: "getBukuTamuHariIni", static: false, private: false, access: { has: function (obj) { return "getBukuTamuHariIni" in obj; }, get: function (obj) { return obj.getBukuTamuHariIni; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBukuTamuMingguIni_decorators, { kind: "method", name: "getBukuTamuMingguIni", static: false, private: false, access: { has: function (obj) { return "getBukuTamuMingguIni" in obj; }, get: function (obj) { return obj.getBukuTamuMingguIni; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBukuTamuBulanIni_decorators, { kind: "method", name: "getBukuTamuBulanIni", static: false, private: false, access: { has: function (obj) { return "getBukuTamuBulanIni" in obj; }, get: function (obj) { return obj.getBukuTamuBulanIni; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllAdmins_decorators, { kind: "method", name: "getAllAdmins", static: false, private: false, access: { has: function (obj) { return "getAllAdmins" in obj; }, get: function (obj) { return obj.getAllAdmins; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateAdmin_decorators, { kind: "method", name: "updateAdmin", static: false, private: false, access: { has: function (obj) { return "updateAdmin" in obj; }, get: function (obj) { return obj.updateAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteAdmin_decorators, { kind: "method", name: "deleteAdmin", static: false, private: false, access: { has: function (obj) { return "deleteAdmin" in obj; }, get: function (obj) { return obj.deleteAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
