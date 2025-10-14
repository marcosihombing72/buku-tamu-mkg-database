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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
var common_1 = require("@nestjs/common");
var crypto_1 = require("crypto");
var dayjs_1 = require("dayjs");
require("dayjs/locale/id");
var customParseFormat_1 = require("dayjs/plugin/customParseFormat");
var isoWeek_1 = require("dayjs/plugin/isoWeek");
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.locale('id');
dayjs_1.default.extend(isoWeek_1.default);
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(supabaseService) {
            this.supabaseService = supabaseService;
        }
        //*** Fungsi login admin ***
        AdminService_1.prototype.loginAdmin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, _a, loginData, loginError, session, user, supabaseAdmin, _b, adminData, adminError;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            return [4 /*yield*/, supabase.auth.signInWithPassword({
                                    email: dto.email,
                                    password: dto.password,
                                })];
                        case 1:
                            _a = _c.sent(), loginData = _a.data, loginError = _a.error;
                            if (loginError || !loginData.session) {
                                throw new common_1.UnauthorizedException("Login gagal: ".concat((loginError === null || loginError === void 0 ? void 0 : loginError.message) || 'Email atau password salah'));
                            }
                            session = loginData.session;
                            user = loginData.user;
                            // Set session ke Supabase client
                            return [4 /*yield*/, supabase.auth.setSession({
                                    access_token: session.access_token,
                                    refresh_token: session.refresh_token,
                                })];
                        case 2:
                            // Set session ke Supabase client
                            _c.sent();
                            supabaseAdmin = this.supabaseService.getAdminClient();
                            return [4 /*yield*/, supabaseAdmin
                                    .from('Admin')
                                    .select('ID_Admin, Peran, Nama_Depan_Admin, Nama_Belakang_Admin, Email_Admin, ID_Stasiun')
                                    .eq('Email_Admin', dto.email)
                                    .single()];
                        case 3:
                            _b = _c.sent(), adminData = _b.data, adminError = _b.error;
                            if (adminError || !adminData) {
                                throw new common_1.BadRequestException("Gagal ambil data admin: ".concat(adminError === null || adminError === void 0 ? void 0 : adminError.message));
                            }
                            //*** Langkah 4: Kembalikan response ***
                            return [2 /*return*/, {
                                    message: 'Login berhasil',
                                    access_token: session.access_token,
                                    refresh_token: session.refresh_token,
                                    user_id: user.id,
                                    peran: adminData.Peran,
                                    nama_depan: adminData.Nama_Depan_Admin,
                                    nama_belakang: adminData.Nama_Belakang_Admin,
                                    id_stasiun: adminData.ID_Stasiun,
                                    expires_at: session.expires_at,
                                }];
                    }
                });
            });
        };
        //*** Fungsi untuk mereset password admin dengan memasukan email dan password baru ***
        AdminService_1.prototype.resetPasswordAdmin = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var supabaseAdmin, _a, listData, listError, user, updateError;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            supabaseAdmin = this.supabaseService.getAdminClient();
                            //*** Langkah 2: Validasi input ***
                            if (!dto.email || !dto.newPassword) {
                                throw new common_1.BadRequestException('Email dan password baru wajib diisi');
                            }
                            return [4 /*yield*/, supabaseAdmin.auth.admin.listUsers()];
                        case 1:
                            _a = _b.sent(), listData = _a.data, listError = _a.error;
                            if (listError) {
                                throw new common_1.BadRequestException("Gagal mencari user: ".concat(listError.message));
                            }
                            user = listData.users.find(function (u) { return u.email === dto.email; });
                            if (!user || !user.id) {
                                throw new common_1.BadRequestException("User dengan email ".concat(dto.email, " tidak ditemukan"));
                            }
                            return [4 /*yield*/, supabaseAdmin.auth.admin.updateUserById(user.id, {
                                    password: dto.newPassword,
                                })];
                        case 2:
                            updateError = (_b.sent()).error;
                            if (updateError) {
                                throw new common_1.BadRequestException("Gagal memperbarui password: ".concat(updateError.message));
                            }
                            //*** Langkah 6: Kembalikan response ***
                            return [2 /*return*/, {
                                    message: 'Password berhasil direset',
                                    email: dto.email,
                                }];
                    }
                });
            });
        };
        //*** Fungsi untuk mendapatkan profil admin ***
        AdminService_1.prototype.getProfile = function (user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, _a, adminData, adminError, transformedData;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select("\n      ID_Admin, \n      Email_Admin, \n      Nama_Depan_Admin, \n      Nama_Belakang_Admin, \n      Peran,\n      Foto_Admin, \n      ID_Stasiun,\n      Stasiun (\n        Nama_Stasiun\n      )\n    ")
                                    .eq('ID_Admin', user_id)
                                    .single()];
                        case 1:
                            _a = _e.sent(), adminData = _a.data, adminError = _a.error;
                            if (adminError) {
                                console.error('Admin data fetch error:', adminError);
                                throw new common_1.BadRequestException('Gagal mengambil data admin');
                            }
                            if (!adminData) {
                                throw new common_1.NotFoundException('Data admin tidak ditemukan');
                            }
                            transformedData = {
                                user_id: adminData.ID_Admin,
                                email: adminData.Email_Admin,
                                nama_depan: adminData.Nama_Depan_Admin,
                                nama_belakang: adminData.Nama_Belakang_Admin,
                                peran: adminData.Peran,
                                foto: adminData.Foto_Admin,
                                stasiun_id: adminData.ID_Stasiun,
                                stasiun_nama: (_d = (_c = (_b = adminData.Stasiun) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.Nama_Stasiun) !== null && _d !== void 0 ? _d : null,
                            };
                            // *** Langkah 4: Kembalikan response ***
                            return [2 /*return*/, {
                                    message: 'Profil admin berhasil diambil',
                                    data: transformedData,
                                }];
                    }
                });
            });
        };
        //*** Fungsi untuk memperbarui profil admin (nama depan, nama belakang, password, foto) ***
        AdminService_1.prototype.updateProfile = function (user, user_id, dto, foto) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, supabaseAdmin, userId, _a, existingAdmin, adminError, fotoUrl, uploadedFileName, updatedFields, fileExt, uploadError, pwError, updatePayload, updateError, updatedAdmin, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            supabaseAdmin = this.supabaseService.getAdminClient();
                            userId = user.id;
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
                                    .eq('ID_Admin', userId)
                                    .single()];
                        case 1:
                            _a = _b.sent(), existingAdmin = _a.data, adminError = _a.error;
                            if (adminError || !existingAdmin) {
                                throw new common_1.BadRequestException('Data admin tidak ditemukan');
                            }
                            fotoUrl = existingAdmin.Foto_Admin;
                            uploadedFileName = null;
                            updatedFields = [];
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 12, , 15]);
                            if (!foto) return [3 /*break*/, 6];
                            if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
                                throw new common_1.BadRequestException('Format file harus JPG atau PNG');
                            }
                            if (foto.size > 10 * 1024 * 1024) {
                                throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
                            }
                            fileExt = foto.originalname.split('.').pop();
                            uploadedFileName = "".concat(user_id, "_").concat(crypto.randomUUID(), ".").concat(fileExt);
                            if (!fotoUrl) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.deleteOldPhoto(fotoUrl)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [4 /*yield*/, supabase.storage
                                .from('foto-admin')
                                .upload(uploadedFileName, foto.buffer, {
                                contentType: foto.mimetype,
                                upsert: true,
                            })];
                        case 5:
                            uploadError = (_b.sent()).error;
                            if (uploadError) {
                                throw new common_1.BadRequestException('Gagal mengunggah foto baru');
                            }
                            fotoUrl = "".concat(process.env.SUPABASE_URL, "/storage/v1/object/public/foto-admin/").concat(uploadedFileName);
                            updatedFields.push('foto');
                            _b.label = 6;
                        case 6:
                            if (!dto.password) return [3 /*break*/, 8];
                            if (dto.password !== dto.confirmPassword) {
                                throw new common_1.BadRequestException('Konfirmasi password tidak cocok');
                            }
                            return [4 /*yield*/, supabaseAdmin.auth.admin.updateUserById(user_id, {
                                    password: dto.password,
                                })];
                        case 7:
                            pwError = (_b.sent()).error;
                            if (pwError) {
                                throw new common_1.BadRequestException('Gagal memperbarui password');
                            }
                            updatedFields.push('password');
                            _b.label = 8;
                        case 8:
                            updatePayload = {};
                            if (dto.nama_depan && dto.nama_depan !== existingAdmin.Nama_Depan_Admin) {
                                updatePayload.Nama_Depan_Admin = dto.nama_depan;
                                updatedFields.push('nama_depan');
                            }
                            if (dto.nama_belakang &&
                                dto.nama_belakang !== existingAdmin.Nama_Belakang_Admin) {
                                updatePayload.Nama_Belakang_Admin = dto.nama_belakang;
                                updatedFields.push('nama_belakang');
                            }
                            if (fotoUrl && fotoUrl !== existingAdmin.Foto_Admin) {
                                updatePayload.Foto_Admin = fotoUrl;
                            }
                            if (!(Object.keys(updatePayload).length > 0)) return [3 /*break*/, 10];
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .update(updatePayload)
                                    .eq('ID_Admin', user_id)];
                        case 9:
                            updateError = (_b.sent()).error;
                            if (updateError) {
                                throw new common_1.BadRequestException('Gagal memperbarui profil admin');
                            }
                            _b.label = 10;
                        case 10: return [4 /*yield*/, supabase
                                .from('Admin')
                                .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
                                .eq('ID_Admin', user_id)
                                .single()];
                        case 11:
                            updatedAdmin = (_b.sent()).data;
                            //*** Langkah 6: Format response ***
                            return [2 /*return*/, {
                                    message: updatedFields.length > 0
                                        ? 'Profil admin berhasil diperbarui'
                                        : 'Tidak ada perubahan yang dilakukan',
                                    data: {
                                        nama_depan: (updatedAdmin === null || updatedAdmin === void 0 ? void 0 : updatedAdmin.Nama_Depan_Admin) || existingAdmin.Nama_Depan_Admin,
                                        nama_belakang: (updatedAdmin === null || updatedAdmin === void 0 ? void 0 : updatedAdmin.Nama_Belakang_Admin) ||
                                            existingAdmin.Nama_Belakang_Admin,
                                        foto: (updatedAdmin === null || updatedAdmin === void 0 ? void 0 : updatedAdmin.Foto_Admin) || existingAdmin.Foto_Admin,
                                    },
                                    updated_fields: updatedFields,
                                }];
                        case 12:
                            error_1 = _b.sent();
                            if (!uploadedFileName) return [3 /*break*/, 14];
                            return [4 /*yield*/, supabase.storage
                                    .from('foto-admin')
                                    .remove([uploadedFileName])
                                    .catch(function (cleanupError) {
                                    return console.error('Gagal hapus foto baru:', cleanupError);
                                })];
                        case 13:
                            _b.sent();
                            _b.label = 14;
                        case 14: throw error_1;
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
        //*** Fungsi untuk menghapus foto lama dari storage Supabase ***
        AdminService_1.prototype.deleteOldPhoto = function (fotoUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, oldFileName, error, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!fotoUrl)
                                return [2 /*return*/]; // kalau kosong, skip
                            oldFileName = fotoUrl.split('/').pop();
                            if (!oldFileName) return [3 /*break*/, 3];
                            return [4 /*yield*/, supabase.storage
                                    .from('foto-admin')
                                    .remove([oldFileName])];
                        case 2:
                            error = (_a.sent()).error;
                            if (error) {
                                console.error('Gagal menghapus foto lama:', error.message);
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            err_1 = _a.sent();
                            console.error('Gagal menghapus foto lama (exception):', err_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        //*** Fungsi untuk mendapatkan data Buku Tamu dengan filter periode dan stasiun ***
        AdminService_1.prototype.getBukuTamu = function (user, user_id, period, startDate, endDate, filterStasiunId) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, userId, _a, adminData, adminError, isSuperadmin, bukuTamuQuery, now, _b, bukuTamuData, bukuTamuError, stasiunIds, _c, stasiunData, stasiunError, stasiunMap, formattedData;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            userId = user.id;
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select("\n      ID_Admin, \n      Peran, \n      ID_Stasiun\n    ")
                                    .eq('ID_Admin', userId)
                                    .single()];
                        case 1:
                            _a = _d.sent(), adminData = _a.data, adminError = _a.error;
                            if (adminError) {
                                console.error('Admin data fetch error:', adminError);
                                throw new common_1.BadRequestException('Gagal mengambil data admin');
                            }
                            if (!adminData) {
                                throw new common_1.NotFoundException('Admin tidak ditemukan');
                            }
                            isSuperadmin = adminData.Peran === 'Superadmin';
                            // Validasi filterStasiunId untuk admin biasa
                            if (!isSuperadmin && filterStasiunId) {
                                throw new common_1.ForbiddenException('Anda tidak boleh filter berdasarkan ID Stasiun');
                            }
                            bukuTamuQuery = supabase
                                .from('Buku_Tamu')
                                .select("\n      ID_Buku_Tamu,\n      ID_Stasiun,\n      Tujuan,\n      Waktu_Kunjungan,\n      Tanda_Tangan,\n      Nama_Depan_Pengunjung,\n      Nama_Belakang_Pengunjung,\n      Email_Pengunjung,\n      No_Telepon_Pengunjung,\n      Asal_Pengunjung,\n      Asal_Instansi,\n      Alamat_Lengkap,\n      Stasiun:ID_Stasiun(Nama_Stasiun)\n    ")
                                .order('Waktu_Kunjungan', { ascending: false });
                            // *** Langkah 4: Filter berdasarkan peran ***
                            if (!isSuperadmin) {
                                if (!adminData.ID_Stasiun) {
                                    throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
                                }
                                bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
                            }
                            else if (filterStasiunId) {
                                bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', filterStasiunId);
                            }
                            now = (0, dayjs_1.default)();
                            if (startDate && endDate) {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', (0, dayjs_1.default)(startDate).startOf('day').toISOString())
                                    .lte('Waktu_Kunjungan', (0, dayjs_1.default)(endDate).endOf('day').toISOString());
                            }
                            else if (period === 'today') {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', now.startOf('day').toISOString())
                                    .lte('Waktu_Kunjungan', now.endOf('day').toISOString());
                            }
                            else if (period === 'week') {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', now.startOf('week').toISOString())
                                    .lte('Waktu_Kunjungan', now.endOf('week').toISOString());
                            }
                            else if (period === 'month') {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', now.startOf('month').toISOString())
                                    .lte('Waktu_Kunjungan', now.endOf('month').toISOString());
                            }
                            return [4 /*yield*/, bukuTamuQuery];
                        case 2:
                            _b = _d.sent(), bukuTamuData = _b.data, bukuTamuError = _b.error;
                            if (bukuTamuError) {
                                console.error('Buku Tamu query error:', bukuTamuError);
                                throw new common_1.BadRequestException('Gagal mengambil data Buku Tamu');
                            }
                            stasiunIds = __spreadArray([], new Set(bukuTamuData.map(function (item) { return item.ID_Stasiun; })), true);
                            return [4 /*yield*/, supabase
                                    .from('Stasiun')
                                    .select('ID_Stasiun, Nama_Stasiun')
                                    .in('ID_Stasiun', stasiunIds)];
                        case 3:
                            _c = _d.sent(), stasiunData = _c.data, stasiunError = _c.error;
                            if (stasiunError) {
                                console.error('Stasiun query error:', stasiunError);
                                throw new common_1.BadRequestException('Gagal mengambil data Stasiun');
                            }
                            stasiunMap = new Map(stasiunData.map(function (s) { return [s.ID_Stasiun, s.Nama_Stasiun]; }));
                            formattedData = bukuTamuData.map(function (item) {
                                var _a;
                                return ({
                                    ID_Buku_Tamu: item.ID_Buku_Tamu,
                                    ID_Stasiun: item.ID_Stasiun,
                                    Tujuan: item.Tujuan,
                                    Waktu_Kunjungan: (0, dayjs_1.default)(item.Waktu_Kunjungan).format('dddd, D MMMM YYYY, HH.mm'),
                                    Tanda_Tangan: item.Tanda_Tangan,
                                    Nama_Depan_Pengunjung: item.Nama_Depan_Pengunjung,
                                    Nama_Belakang_Pengunjung: item.Nama_Belakang_Pengunjung,
                                    Email_Pengunjung: item.Email_Pengunjung,
                                    No_Telepon_Pengunjung: item.No_Telepon_Pengunjung,
                                    Asal_Pengunjung: item.Asal_Pengunjung,
                                    Asal_Instansi: item.Asal_Instansi,
                                    Alamat_Lengkap: item.Alamat_Lengkap,
                                    Nama_Stasiun: (_a = stasiunMap.get(item.ID_Stasiun)) !== null && _a !== void 0 ? _a : null,
                                });
                            });
                            // *** Langkah 9: Return hasil ***
                            return [2 /*return*/, {
                                    filter: {
                                        period: period || null,
                                        startDate: startDate || null,
                                        endDate: endDate || null,
                                        filterStasiunId: isSuperadmin
                                            ? filterStasiunId || null
                                            : adminData.ID_Stasiun,
                                    },
                                    isSuperadmin: isSuperadmin,
                                    count: formattedData.length,
                                    data: formattedData,
                                }];
                    }
                });
            });
        };
        //*** Fungsi helper untuk mendapatkan data Buku Tamu berdasarkan periode tertentu (hari ini, minggu ini, bulan ini) ***
        AdminService_1.prototype.getBukuTamuByPeriod = function (user, user_id, period) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, userId, _a, adminData, adminError, isSuperadmin, bukuTamuQuery, now, _b, data, error, formattedData;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            userId = user.id;
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Peran, ID_Stasiun')
                                    .eq('ID_Admin', userId)
                                    .single()];
                        case 1:
                            _a = _c.sent(), adminData = _a.data, adminError = _a.error;
                            if (adminError || !adminData) {
                                throw new common_1.BadRequestException('Data admin tidak ditemukan');
                            }
                            isSuperadmin = adminData.Peran === 'Superadmin';
                            bukuTamuQuery = supabase
                                .from('Buku_Tamu')
                                .select("\n      ID_Buku_Tamu,\n      ID_Stasiun,\n      Tujuan,\n      Waktu_Kunjungan,\n      Tanda_Tangan,\n      Nama_Depan_Pengunjung,\n      Nama_Belakang_Pengunjung,\n      Email_Pengunjung,\n      No_Telepon_Pengunjung,\n      Asal_Pengunjung,\n      Asal_Instansi,\n      Alamat_Lengkap,\n      Stasiun:ID_Stasiun(Nama_Stasiun)\n    ")
                                .order('Waktu_Kunjungan', { ascending: false });
                            // *** Langkah 4: Filter berdasarkan peran ***
                            if (!isSuperadmin) {
                                if (!adminData.ID_Stasiun) {
                                    throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
                                }
                                bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
                            }
                            now = (0, dayjs_1.default)();
                            if (period === 'today') {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', now.startOf('day').toISOString())
                                    .lte('Waktu_Kunjungan', now.endOf('day').toISOString());
                            }
                            else if (period === 'week') {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', now.startOf('week').toISOString())
                                    .lte('Waktu_Kunjungan', now.endOf('week').toISOString());
                            }
                            else if (period === 'month') {
                                bukuTamuQuery = bukuTamuQuery
                                    .gte('Waktu_Kunjungan', now.startOf('month').toISOString())
                                    .lte('Waktu_Kunjungan', now.endOf('month').toISOString());
                            }
                            else {
                                throw new common_1.BadRequestException('Periode filter tidak valid');
                            }
                            return [4 /*yield*/, bukuTamuQuery];
                        case 2:
                            _b = _c.sent(), data = _b.data, error = _b.error;
                            if (error) {
                                throw new common_1.BadRequestException("Gagal mengambil data Buku Tamu: ".concat(error.message));
                            }
                            formattedData = (data === null || data === void 0 ? void 0 : data.map(function (item) { return (__assign(__assign({}, item), { Waktu_Kunjungan: (0, dayjs_1.default)(item.Waktu_Kunjungan).format('dddd, D MMMM YYYY, HH.mm') })); })) || [];
                            // *** Langkah 8: Kembalikan response ***
                            return [2 /*return*/, {
                                    period: period,
                                    isSuperadmin: isSuperadmin,
                                    stationFilter: !isSuperadmin ? adminData.ID_Stasiun : 'all',
                                    count: formattedData.length,
                                    data: formattedData,
                                }];
                    }
                });
            });
        };
        //*** Fungsi untuk mendapatkan data Buku Tamu hari ini ***
        AdminService_1.prototype.getBukuTamuHariIni = function (user, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getBukuTamuByPeriod(user, user_id, 'today')];
                });
            });
        };
        //*** Fungsi untuk mendapatkan data Buku Tamu minggu ini ***
        AdminService_1.prototype.getBukuTamuMingguIni = function (user, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getBukuTamuByPeriod(user, user_id, 'week')];
                });
            });
        };
        //*** Fungsi untuk mendapatkan data Buku Tamu bulan ini ***
        AdminService_1.prototype.getBukuTamuBulanIni = function (user, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getBukuTamuByPeriod(user, user_id, 'month')];
                });
            });
        };
        //*** Fungsi untuk mendapatkan semua data admin dengan fitur search dan filter (hanya untuk Superadmin) ***
        AdminService_1.prototype.getAllAdmins = function (user, user_id, search, filterPeran, filterStasiunId) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, userId, _a, currentAdmin, currentAdminError, query, _b, data, error;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            userId = user.id;
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Peran, ID_Stasiun')
                                    .eq('ID_Admin', userId)
                                    .single()];
                        case 1:
                            _a = _c.sent(), currentAdmin = _a.data, currentAdminError = _a.error;
                            if (currentAdminError || !currentAdmin) {
                                throw new common_1.BadRequestException('Data admin tidak ditemukan');
                            }
                            //*** Langkah 3: Hanya Superadmin yang bisa akses data semua admin ***
                            if (currentAdmin.Peran !== 'Superadmin') {
                                throw new common_1.UnauthorizedException('Hanya Superadmin yang bisa mengakses data semua admin');
                            }
                            query = supabase.from('Admin').select("\n    ID_Admin,\n    Nama_Depan_Admin,\n    Nama_Belakang_Admin,\n    Email_Admin,\n    Peran,\n    Foto_Admin,\n    Created_At,\n    Stasiun (\n      ID_Stasiun,\n      Nama_Stasiun\n    )\n  ");
                            //*** Langkah 5: Filter pencarian (nama depan, nama belakang, email, nama stasiun) ***
                            if (search) {
                                query = query.or("Nama_Depan_Admin.ilike.%".concat(search, "%,Nama_Belakang_Admin.ilike.%").concat(search, "%,Email_Admin.ilike.%").concat(search, "%,Stasiun.Nama_Stasiun.ilike.%").concat(search, "%"));
                            }
                            //*** Langkah 6: Filter peran dan ID_Stasiun ***
                            if (filterPeran) {
                                query = query.eq('Peran', filterPeran);
                            }
                            if (filterStasiunId) {
                                query = query.eq('ID_Stasiun', filterStasiunId);
                            }
                            return [4 /*yield*/, query];
                        case 2:
                            _b = _c.sent(), data = _b.data, error = _b.error;
                            if (error) {
                                throw new common_1.BadRequestException('Gagal mengambil data admin');
                            }
                            //*** Langkah 8: Kembalikan response ***
                            return [2 /*return*/, {
                                    message: 'Data admin berhasil diambil',
                                    count: (data === null || data === void 0 ? void 0 : data.length) || 0,
                                    data: data,
                                }];
                    }
                });
            });
        };
        //*** Fungsi untuk menambahkan admin baru (hanya untuk Superadmin) ***
        // async createAdmin(
        //   dto: CreateAdminDto,
        //   foto: Express.Multer.File,
        //   access_token: string,
        //   user_id: string,
        // ) {
        //   const supabase = this.supabaseService.getClient();
        //   const supabaseAdmin = this.supabaseService.getAdminClient();
        //   // ... (validasi token & role tetap sama)
        //   // Validasi password
        //   if (dto.password !== dto.confirmPassword) {
        //     throw new BadRequestException('Konfirmasi password tidak cocok');
        //   }
        //   // Buat user baru di Supabase Auth
        //   const { data: newUser, error: createUserError } =
        //     await supabaseAdmin.auth.admin.createUser({
        //       email: dto.email,
        //       password: dto.password,
        //       email_confirm: true,
        //     });
        //   if (createUserError) {
        //     throw new BadRequestException(
        //       'Gagal membuat user baru: ' + createUserError.message,
        //     );
        //   }
        //   const newUserId = newUser.user.id;
        //   let fotoUrl: string | null = null;
        //   if (foto) {
        //     if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
        //       throw new BadRequestException('Format file harus JPG atau PNG');
        //     }
        //     if (foto.size > 10 * 1024 * 1024) {
        //       throw new BadRequestException('Ukuran file maksimal 10MB');
        //     }
        //     const fileExt = foto.originalname.split('.').pop();
        //     const uniqueId = randomUUID();
        //     const uploadedFileName = `${newUserId}_${uniqueId}.${fileExt}`;
        //     const { error: uploadError } = await supabase.storage
        //       .from('foto-admin')
        //       .upload(uploadedFileName, foto.buffer, {
        //         contentType: foto.mimetype,
        //         upsert: true,
        //       });
        //     if (uploadError) {
        //       throw new BadRequestException('Gagal mengunggah foto baru');
        //     }
        //     fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/foto-admin/${uploadedFileName}`;
        //   }
        //   // Simpan ke tabel Admin
        //   const { error: insertError } = await supabase.from('Admin').insert([
        //     {
        //       ID_Admin: newUserId,
        //       Peran: dto.peran,
        //       ID_Stasiun: dto.peran === 'Admin' ? dto.id_stasiun : null,
        //       Created_At: new Date().toISOString(),
        //       Nama_Depan_Admin: dto.nama_depan,
        //       Nama_Belakang_Admin: dto.nama_belakang || null,
        //       Email_Admin: dto.email,
        //       Foto_Admin: fotoUrl,
        //     },
        //   ]);
        //   if (insertError) {
        //     throw new BadRequestException(
        //       'Gagal menyimpan data admin: ' + insertError.message,
        //     );
        //   }
        //   return {
        //     message: 'Admin berhasil dibuat',
        //     id: newUserId,
        //     email: dto.email,
        //     peran: dto.peran,
        //   };
        // }
        //*** Fungsi untuk mengupdate admin (Superadmin) ***
        AdminService_1.prototype.updateAdmin = function (user, id_admin, dto, user_id) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, supabaseAdmin, userId, _a, currentAdmin, currentError, isSuperadmin, _b, existingAdmin, existingError, fotoUrl, updatePassError, fileExt, uniqueId, filePath, uploadError, updatePayload, updateError;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            supabaseAdmin = this.supabaseService.getAdminClient();
                            userId = user.id;
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Peran')
                                    .eq('ID_Admin', userId)
                                    .single()];
                        case 1:
                            _a = _c.sent(), currentAdmin = _a.data, currentError = _a.error;
                            if (currentError || !currentAdmin) {
                                throw new common_1.UnauthorizedException('Data admin tidak ditemukan');
                            }
                            isSuperadmin = currentAdmin.Peran === 'Superadmin';
                            if (!isSuperadmin && user_id !== id_admin) {
                                throw new common_1.UnauthorizedException('Tidak diizinkan untuk update admin lain');
                            }
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Foto_Admin')
                                    .eq('ID_Admin', id_admin)
                                    .single()];
                        case 2:
                            _b = _c.sent(), existingAdmin = _b.data, existingError = _b.error;
                            if (existingError) {
                                throw new common_1.BadRequestException('Gagal mengambil data admin lama');
                            }
                            fotoUrl = (existingAdmin === null || existingAdmin === void 0 ? void 0 : existingAdmin.Foto_Admin) || null;
                            if (!dto.password) return [3 /*break*/, 4];
                            if (dto.password !== dto.confirmPassword) {
                                throw new common_1.BadRequestException('Konfirmasi password tidak cocok');
                            }
                            return [4 /*yield*/, supabaseAdmin.auth.admin.updateUserById(id_admin, {
                                    password: dto.password,
                                })];
                        case 3:
                            updatePassError = (_c.sent()).error;
                            if (updatePassError) {
                                throw new common_1.BadRequestException('Gagal update password: ' + updatePassError.message);
                            }
                            _c.label = 4;
                        case 4:
                            if (!dto.foto) return [3 /*break*/, 8];
                            if (!['image/jpeg', 'image/png'].includes(dto.foto.mimetype)) {
                                throw new common_1.BadRequestException('Format file harus JPG atau PNG');
                            }
                            if (dto.foto.size > 10 * 1024 * 1024) {
                                throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
                            }
                            if (!(existingAdmin === null || existingAdmin === void 0 ? void 0 : existingAdmin.Foto_Admin)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.deleteOldPhoto(existingAdmin.Foto_Admin)];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6:
                            fileExt = dto.foto.originalname.split('.').pop();
                            uniqueId = (0, crypto_1.randomUUID)();
                            filePath = "".concat(id_admin, "_").concat(uniqueId, ".").concat(fileExt);
                            return [4 /*yield*/, supabase.storage
                                    .from('foto-admin')
                                    .upload(filePath, dto.foto.buffer, {
                                    contentType: dto.foto.mimetype,
                                    upsert: true,
                                })];
                        case 7:
                            uploadError = (_c.sent()).error;
                            if (uploadError) {
                                throw new common_1.BadRequestException('Gagal upload foto: ' + uploadError.message);
                            }
                            fotoUrl = "".concat(process.env.SUPABASE_URL, "/storage/v1/object/public/foto-admin/").concat(filePath);
                            _c.label = 8;
                        case 8:
                            updatePayload = __assign(__assign(__assign({}, (dto.nama_depan && { Nama_Depan_Admin: dto.nama_depan })), (dto.nama_belakang && { Nama_Belakang_Admin: dto.nama_belakang })), (fotoUrl && { Foto_Admin: fotoUrl }));
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .update(updatePayload)
                                    .eq('ID_Admin', id_admin)];
                        case 9:
                            updateError = (_c.sent()).error;
                            if (updateError) {
                                throw new common_1.BadRequestException('Gagal update data admin: ' + updateError.message);
                            }
                            //*** Langkah 8: Return hasil ***
                            return [2 /*return*/, {
                                    message: 'Admin berhasil diupdate',
                                    updated_fields: updatePayload,
                                }];
                    }
                });
            });
        };
        //*** Fungsi untuk menghapus admin (hanya untuk Superadmin) ***
        AdminService_1.prototype.deleteAdmin = function (user, user_id, id_admin) {
            return __awaiter(this, void 0, void 0, function () {
                var supabase, supabaseAdmin, userId, _a, currentAdmin, currentError, _b, adminToDelete, adminError, deleteUserError, deleteAdminError;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            supabase = this.supabaseService.getClient();
                            supabaseAdmin = this.supabaseService.getAdminClient();
                            userId = user.id;
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Peran')
                                    .eq('ID_Admin', user.id)
                                    .single()];
                        case 1:
                            _a = _c.sent(), currentAdmin = _a.data, currentError = _a.error;
                            if (currentError || !currentAdmin) {
                                throw new common_1.UnauthorizedException('Data admin login tidak ditemukan');
                            }
                            if (currentAdmin.Peran !== 'Superadmin') {
                                throw new common_1.UnauthorizedException('Hanya Superadmin yang dapat menghapus admin');
                            }
                            if (user_id === id_admin) {
                                throw new common_1.BadRequestException('Tidak dapat menghapus akun sendiri');
                            }
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .select('Foto_Admin')
                                    .eq('ID_Admin', id_admin)
                                    .single()];
                        case 2:
                            _b = _c.sent(), adminToDelete = _b.data, adminError = _b.error;
                            if (adminError || !adminToDelete) {
                                throw new common_1.NotFoundException('Admin yang akan dihapus tidak ditemukan');
                            }
                            if (!adminToDelete.Foto_Admin) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.deleteOldPhoto(adminToDelete.Foto_Admin)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4: return [4 /*yield*/, supabaseAdmin.auth.admin.deleteUser(id_admin)];
                        case 5:
                            deleteUserError = (_c.sent()).error;
                            if (deleteUserError) {
                                throw new common_1.BadRequestException('Gagal menghapus user: ' + deleteUserError.message);
                            }
                            return [4 /*yield*/, supabase
                                    .from('Admin')
                                    .delete()
                                    .eq('ID_Admin', id_admin)];
                        case 6:
                            deleteAdminError = (_c.sent()).error;
                            if (deleteAdminError) {
                                throw new common_1.BadRequestException('Gagal menghapus data admin: ' + deleteAdminError.message);
                            }
                            //*** Langkah 7: Return hasil ***
                            return [2 /*return*/, { message: 'Admin berhasil dihapus' }];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
