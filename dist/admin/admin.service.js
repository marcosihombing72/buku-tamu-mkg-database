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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const supabase_service_1 = require("../supabase/supabase.service");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/id");
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const isoWeek_1 = __importDefault(require("dayjs/plugin/isoWeek"));
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.locale('id');
dayjs_1.default.extend(isoWeek_1.default);
let AdminService = class AdminService {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async loginAdmin(dto) {
        const supabase = this.supabaseService.getClient();
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: dto.email,
            password: dto.password,
        });
        if (loginError || !loginData.session) {
            throw new common_1.UnauthorizedException(`Login gagal: ${loginError?.message || 'Email atau password salah'}`);
        }
        let session = loginData.session;
        const user = loginData.user;
        await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        });
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select('ID_Admin, Peran, Nama_Depan_Admin, Nama_Belakang_Admin, Email_Admin')
            .eq('Email_Admin', dto.email)
            .single();
        if (adminError || !adminData) {
            throw new common_1.BadRequestException(`Gagal ambil data admin: ${adminError?.message}`);
        }
        return {
            message: 'Login berhasil',
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user_id: user.id,
            peran: adminData.Peran,
            nama_depan: adminData.Nama_Depan_Admin,
            nama_belakang: adminData.Nama_Belakang_Admin,
            expires_at: session.expires_at,
        };
    }
    async resetPasswordAdmin(dto) {
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers({
            perPage: 1000,
        });
        if (userError) {
            throw new common_1.BadRequestException(`Gagal mencari user: ${userError.message}`);
        }
        const user = users?.users?.find((u) => u.email === dto.email);
        if (!user || !user.id) {
            throw new common_1.BadRequestException(`User dengan email ${dto.email} tidak ditemukan`);
        }
        const userId = user.id;
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: dto.newPassword,
        });
        if (updateError) {
            throw new common_1.BadRequestException(`Gagal memperbarui password: ${updateError.message}`);
        }
        return {
            message: 'Password berhasil direset',
            email: dto.email,
        };
    }
    async getProfile(user_id, access_token) {
        const supabase = this.supabaseService.getClient();
        const { data: { user }, error, } = await supabase.auth.getUser(access_token);
        if (error || !user?.id || user.id !== user_id) {
            console.error('Invalid token or mismatch:', {
                error,
                tokenUserId: user?.id,
                requestedUserId: user_id,
            });
            throw new common_1.UnauthorizedException('Invalid token or user mismatch');
        }
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select(`
      ID_Admin, 
      Email_Admin, 
      Nama_Depan_Admin, 
      Nama_Belakang_Admin, 
      Peran,
      Foto_Admin, 
      ID_Stasiun,
      Stasiun (
        Nama_Stasiun
      )
      `)
            .eq('ID_Admin', user.id)
            .single();
        if (adminError) {
            console.error('Admin data fetch error:', adminError);
            throw new common_1.BadRequestException('Failed to fetch admin data');
        }
        if (!adminData) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const transformedData = {
            user_id: adminData.ID_Admin,
            email: adminData.Email_Admin,
            nama_depan: adminData.Nama_Depan_Admin,
            nama_belakang: adminData.Nama_Belakang_Admin,
            peran: adminData.Peran,
            foto: adminData.Foto_Admin,
            stasiun_id: adminData.ID_Stasiun,
            stasiun_nama: adminData.Stasiun?.[0]?.Nama_Stasiun ?? null,
        };
        return {
            message: 'Admin profile retrieved successfully',
            data: transformedData,
        };
    }
    async updateProfile(dto, foto) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { user_id, access_token, nama_depan, nama_belakang, password, confirmPassword, } = dto;
        const { data: { user }, error: authError, } = await supabase.auth.getUser(access_token);
        if (authError || !user?.id || user.id !== user_id) {
            throw new common_1.UnauthorizedException('Token tidak valid atau tidak sesuai');
        }
        const { data: existingAdmin, error: adminError } = await supabase
            .from('Admin')
            .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
            .eq('ID_Admin', user_id)
            .single();
        if (adminError || !existingAdmin) {
            throw new common_1.BadRequestException('Data admin tidak ditemukan');
        }
        let fotoUrl = existingAdmin.Foto_Admin;
        let uploadedFileName = null;
        let updatedFields = [];
        try {
            if (foto) {
                if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
                    throw new common_1.BadRequestException('Format file harus JPG atau PNG');
                }
                if (foto.size > 10 * 1024 * 1024) {
                    throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
                }
                const fileExt = foto.originalname.split('.').pop();
                uploadedFileName = `${user_id}_${(0, crypto_1.randomUUID)()}.${fileExt}`;
                if (fotoUrl) {
                    await this.deleteOldPhoto(fotoUrl);
                }
                const { error: uploadError } = await supabase.storage
                    .from('foto-admin')
                    .upload(uploadedFileName, foto.buffer, {
                    contentType: foto.mimetype,
                    upsert: true,
                });
                if (uploadError) {
                    throw new common_1.BadRequestException('Gagal mengunggah foto baru');
                }
                fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/foto-admin/${uploadedFileName}`;
                updatedFields.push('foto');
            }
            if (password) {
                if (password !== confirmPassword) {
                    throw new common_1.BadRequestException('Konfirmasi password tidak cocok');
                }
                const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password });
                if (pwError) {
                    throw new common_1.BadRequestException('Gagal memperbarui password');
                }
                updatedFields.push('password');
            }
            const updatePayload = {};
            if (nama_depan && nama_depan !== existingAdmin.Nama_Depan_Admin) {
                updatePayload.Nama_Depan_Admin = nama_depan;
                updatedFields.push('nama_depan');
            }
            if (nama_belakang &&
                nama_belakang !== existingAdmin.Nama_Belakang_Admin) {
                updatePayload.Nama_Belakang_Admin = nama_belakang;
                updatedFields.push('nama_belakang');
            }
            if (fotoUrl && fotoUrl !== existingAdmin.Foto_Admin) {
                updatePayload.Foto_Admin = fotoUrl;
            }
            if (Object.keys(updatePayload).length > 0) {
                const { error: updateError } = await supabase
                    .from('Admin')
                    .update(updatePayload)
                    .eq('ID_Admin', user_id);
                if (updateError) {
                    throw new common_1.BadRequestException('Gagal memperbarui profil admin');
                }
            }
            const { data: updatedAdmin } = await supabase
                .from('Admin')
                .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
                .eq('ID_Admin', user_id)
                .single();
            const transformedData = {
                nama_depan: updatedAdmin?.Nama_Depan_Admin || existingAdmin.Nama_Depan_Admin,
                nama_belakang: updatedAdmin?.Nama_Belakang_Admin ||
                    existingAdmin.Nama_Belakang_Admin,
                foto: updatedAdmin?.Foto_Admin || existingAdmin.Foto_Admin,
            };
            return {
                message: updatedFields.length > 0
                    ? 'Profil admin berhasil diperbarui'
                    : 'Tidak ada perubahan yang dilakukan',
                data: transformedData,
                updated_fields: updatedFields,
            };
        }
        catch (error) {
            if (uploadedFileName) {
                await supabase.storage
                    .from('foto-admin')
                    .remove([uploadedFileName])
                    .catch((cleanupError) => {
                    console.error('Gagal menghapus foto yang baru diupload:', cleanupError);
                });
            }
            throw error;
        }
    }
    async deleteOldPhoto(fotoUrl) {
        const supabase = this.supabaseService.getClient();
        try {
            if (!fotoUrl)
                return;
            const oldFileName = fotoUrl.split('/').pop();
            if (oldFileName) {
                const { error } = await supabase.storage
                    .from('foto-admin')
                    .remove([oldFileName]);
                if (error) {
                    console.error('Gagal menghapus foto lama:', error.message);
                }
            }
        }
        catch (err) {
            console.error('Gagal menghapus foto lama (exception):', err);
        }
    }
    async getDashboard(user_id, access_token) {
        const supabase = this.supabaseService.getClient();
        const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            throw new common_1.UnauthorizedException('Token tidak valid atau sudah kedaluwarsa');
        }
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select('Peran, ID_Stasiun')
            .eq('ID_Admin', user_id)
            .single();
        if (adminError || !adminData) {
            throw new common_1.UnauthorizedException('Admin tidak ditemukan');
        }
        const isSuperadmin = adminData.Peran === 'Superadmin';
        let bukuTamuQuery = supabase
            .from('Buku_Tamu')
            .select('ID_Buku_Tamu', { count: 'exact', head: true });
        if (!isSuperadmin) {
            if (!adminData.ID_Stasiun) {
                throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
            }
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
        }
        const { count, error: bukuTamuError } = await bukuTamuQuery;
        if (bukuTamuError) {
            throw new common_1.BadRequestException(`Gagal menghitung data Buku Tamu: ${bukuTamuError.message}`);
        }
        return {
            peran: adminData.Peran,
            id_stasiun: adminData.ID_Stasiun || null,
            jumlah_tamu: count || 0,
        };
    }
    async getBukuTamu(access_token, user_id, period, startDate, endDate, filterStasiunId) {
        const supabase = this.supabaseService.getClient();
        const { data: { user }, error, } = await supabase.auth.getUser(access_token);
        if (error || !user?.id || user.id !== user_id) {
            console.error('Invalid token or mismatch:', {
                error,
                tokenUserId: user?.id,
                requestedUserId: user_id,
            });
            throw new common_1.UnauthorizedException('Invalid token or user mismatch');
        }
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select(`
      ID_Admin, 
      Peran, 
      ID_Stasiun
    `)
            .eq('ID_Admin', user.id)
            .single();
        if (adminError) {
            console.error('Admin data fetch error:', adminError);
            throw new common_1.BadRequestException('Failed to fetch admin data');
        }
        if (!adminData) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const isSuperadmin = adminData.Peran === 'Superadmin';
        if (!isSuperadmin && filterStasiunId) {
            throw new common_1.ForbiddenException('Anda tidak boleh filter berdasarkan ID Stasiun');
        }
        let bukuTamuQuery = supabase
            .from('Buku_Tamu')
            .select(`
    ID_Buku_Tamu,
    ID_Stasiun,
    Tujuan,
    Waktu_Kunjungan,
    Tanda_Tangan,
    Nama_Depan_Pengunjung,
    Nama_Belakang_Pengunjung,
    Email_Pengunjung,
    No_Telepon_Pengunjung,
    Asal_Pengunjung,
    Asal_Instansi,
    Alamat_Lengkap,
    Stasiun:ID_Stasiun(Nama_Stasiun)
  `)
            .order('Waktu_Kunjungan', { ascending: false });
        if (!isSuperadmin) {
            if (!adminData.ID_Stasiun) {
                throw new common_1.BadRequestException('Admin tidak punya ID_Stasiun');
            }
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
        }
        else if (filterStasiunId) {
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', filterStasiunId);
        }
        const now = (0, dayjs_1.default)();
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
            const startOfWeek = now.startOf('week');
            const endOfWeek = now.endOf('week');
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', startOfWeek.toISOString())
                .lte('Waktu_Kunjungan', endOfWeek.toISOString());
        }
        else if (period === 'month') {
            const startOfMonth = now.startOf('month');
            const endOfMonth = now.endOf('month');
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', startOfMonth.toISOString())
                .lte('Waktu_Kunjungan', endOfMonth.toISOString());
        }
        const { data: bukuTamuData, error: bukuTamuError } = await bukuTamuQuery;
        if (bukuTamuError) {
            console.error('Buku Tamu query error:', bukuTamuError);
            throw new common_1.BadRequestException('Failed to fetch Buku Tamu');
        }
        const formattedData = bukuTamuData.map((item) => ({
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
            Nama_Stasiun: item.Stasiun?.[0]?.Nama_Stasiun ?? null,
        }));
        return {
            filter: {
                period: period || null,
                startDate: startDate || null,
                endDate: endDate || null,
                filterStasiunId: isSuperadmin
                    ? filterStasiunId || null
                    : adminData.ID_Stasiun,
            },
            isSuperadmin,
            count: formattedData.length,
            data: formattedData,
        };
    }
    async getBukuTamuByPeriod(access_token, user_id, period) {
        const supabase = this.supabaseService.getClient();
        const { data: authData, error: authError } = await supabase.auth.getUser(access_token);
        if (authError || !authData?.user || authData.user.id !== user_id) {
            throw new common_1.UnauthorizedException('Token tidak valid atau tidak cocok dengan user_id');
        }
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select('Peran, ID_Stasiun')
            .eq('ID_Admin', user_id)
            .single();
        if (adminError || !adminData) {
            throw new common_1.BadRequestException('Data admin tidak ditemukan');
        }
        const isSuperadmin = adminData.Peran === 'Superadmin';
        let bukuTamuQuery = supabase
            .from('Buku_Tamu')
            .select(`
      ID_Buku_Tamu,
      ID_Stasiun,
      Tujuan,
      Waktu_Kunjungan,
      Tanda_Tangan,
      Nama_Depan_Pengunjung,
      Nama_Belakang_Pengunjung,
      Email_Pengunjung,
      No_Telepon_Pengunjung,
      Asal_Pengunjung,
      Asal_Instansi,
      Alamat_Lengkap,
      Stasiun:ID_Stasiun(Nama_Stasiun)
    `)
            .order('Waktu_Kunjungan', { ascending: false });
        if (!isSuperadmin) {
            if (!adminData.ID_Stasiun) {
                throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
            }
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
        }
        const now = (0, dayjs_1.default)();
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
        const { data, error } = await bukuTamuQuery;
        if (error) {
            throw new common_1.BadRequestException(`Gagal mengambil data Buku Tamu: ${error.message}`);
        }
        const formattedData = data?.map((item) => ({
            ...item,
            Waktu_Kunjungan: (0, dayjs_1.default)(item.Waktu_Kunjungan).format('dddd, D MMMM YYYY, HH.mm'),
        })) || [];
        return {
            period,
            isSuperadmin,
            stationFilter: !isSuperadmin ? adminData.ID_Stasiun : 'all',
            count: formattedData.length,
            data: formattedData,
        };
    }
    async getBukuTamuHariIni(access_token, user_id) {
        return this.getBukuTamuByPeriod(access_token, user_id, 'today');
    }
    async getBukuTamuMingguIni(access_token, user_id) {
        return this.getBukuTamuByPeriod(access_token, user_id, 'week');
    }
    async getBukuTamuBulanIni(access_token, user_id) {
        return this.getBukuTamuByPeriod(access_token, user_id, 'month');
    }
    async getAllAdmins(access_token, user_id, search, filterPeran, filterStasiunId) {
        const supabase = this.supabaseService.getClient();
        const { data: { user }, error: authError, } = await supabase.auth.getUser(access_token);
        if (authError || !user?.id || user.id !== user_id) {
            throw new common_1.UnauthorizedException('Token tidak valid atau tidak sesuai');
        }
        const { data: currentAdmin, error: currentAdminError } = await supabase
            .from('Admin')
            .select('Peran, ID_Stasiun')
            .eq('ID_Admin', user_id)
            .single();
        if (currentAdminError || !currentAdmin) {
            throw new common_1.BadRequestException('Data admin tidak ditemukan');
        }
        if (currentAdmin.Peran !== 'Superadmin') {
            throw new common_1.UnauthorizedException('Hanya Superadmin yang bisa mengakses data semua admin');
        }
        let query = supabase.from('Admin').select(`
      ID_Admin,
      Nama_Depan_Admin,
      Nama_Belakang_Admin,
      Email_Admin,
      Peran,
      Foto_Admin,
      Created_At,
      Stasiun (
        ID_Stasiun,
        Nama_Stasiun
      )
    `);
        if (search) {
            query = query.or(`Nama_Depan_Admin.ilike.%${search}%,Nama_Belakang_Admin.ilike.%${search}%,Email_Admin.ilike.%${search}%,Stasiun.Nama_Stasiun.ilike.%${search}%`);
        }
        if (filterPeran) {
            query = query.eq('Peran', filterPeran);
        }
        if (filterStasiunId) {
            query = query.eq('ID_Stasiun', filterStasiunId);
        }
        const { data, error } = await query;
        if (error) {
            throw new common_1.BadRequestException('Gagal mengambil data admin');
        }
        return {
            message: 'Data admin berhasil diambil',
            count: data?.length || 0,
            data,
        };
    }
    async updateAdmin(id_admin, dto, access_token, user_id) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { data: { user }, error: authError, } = await supabase.auth.getUser(access_token);
        if (authError || !user?.id || user.id !== user_id) {
            throw new common_1.UnauthorizedException('Token tidak valid atau tidak sesuai');
        }
        const { data: currentAdmin } = await supabase
            .from('Admin')
            .select('Peran')
            .eq('ID_Admin', user_id)
            .single();
        if (!currentAdmin) {
            throw new common_1.UnauthorizedException('Data admin tidak ditemukan');
        }
        if (currentAdmin.Peran !== 'Superadmin' && user_id !== id_admin) {
            throw new common_1.UnauthorizedException('Tidak diizinkan update admin lain');
        }
        if (dto.password) {
            if (dto.password !== dto.confirmPassword) {
                throw new common_1.BadRequestException('Konfirmasi password tidak cocok');
            }
            const { error: updatePassError } = await supabaseAdmin.auth.admin.updateUserById(id_admin, {
                password: dto.password,
            });
            if (updatePassError) {
                throw new common_1.BadRequestException('Gagal update password: ' + updatePassError.message);
            }
        }
        const { data: existingAdmin } = await supabase
            .from('Admin')
            .select('Foto_Admin')
            .eq('ID_Admin', id_admin)
            .single();
        let fotoUrl = null;
        if (dto.foto) {
            if (!['image/jpeg', 'image/png'].includes(dto.foto.mimetype)) {
                throw new common_1.BadRequestException('Format file harus JPG atau PNG');
            }
            if (dto.foto.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
            }
            if (existingAdmin?.Foto_Admin) {
                await this.deleteOldPhoto(existingAdmin.Foto_Admin);
            }
            const fileExt = dto.foto.originalname.split('.').pop();
            const uniqueId = (0, crypto_1.randomUUID)();
            const filePath = `${id_admin}_${uniqueId}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('foto-admin')
                .upload(filePath, dto.foto.buffer, {
                contentType: dto.foto.mimetype,
                upsert: true,
            });
            if (uploadError) {
                throw new common_1.BadRequestException('Gagal upload foto: ' + uploadError.message);
            }
            fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/foto-admin/${filePath}`;
        }
        const { error: updateError } = await supabase
            .from('Admin')
            .update({
            Nama_Depan_Admin: dto.nama_depan || undefined,
            Nama_Belakang_Admin: dto.nama_belakang || undefined,
            Foto_Admin: fotoUrl || undefined,
        })
            .eq('ID_Admin', id_admin);
        if (updateError) {
            throw new common_1.BadRequestException('Gagal update data admin: ' + updateError.message);
        }
        return { message: 'Admin berhasil diupdate' };
    }
    async deleteAdmin(access_token, user_id, id_admin) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { data: { user }, error: authError, } = await supabase.auth.getUser(access_token);
        if (authError || !user?.id || user.id !== user_id) {
            throw new common_1.UnauthorizedException('Token tidak valid atau tidak sesuai');
        }
        const { data: currentAdmin } = await supabase
            .from('Admin')
            .select('Peran')
            .eq('ID_Admin', user_id)
            .single();
        if (!currentAdmin || currentAdmin.Peran !== 'Superadmin') {
            throw new common_1.UnauthorizedException('Hanya Superadmin yang bisa menghapus admin');
        }
        if (user_id === id_admin) {
            throw new common_1.BadRequestException('Tidak bisa menghapus diri sendiri');
        }
        const { data: adminToDelete } = await supabase
            .from('Admin')
            .select('Foto_Admin')
            .eq('ID_Admin', id_admin)
            .single();
        if (!adminToDelete) {
            throw new common_1.NotFoundException('Admin yang akan dihapus tidak ditemukan');
        }
        if (adminToDelete.Foto_Admin) {
            await this.deleteOldPhoto(adminToDelete.Foto_Admin);
        }
        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(id_admin);
        if (deleteUserError) {
            throw new common_1.BadRequestException('Gagal menghapus user: ' + deleteUserError.message);
        }
        const { error: deleteAdminError } = await supabase
            .from('Admin')
            .delete()
            .eq('ID_Admin', id_admin);
        if (deleteAdminError) {
            throw new common_1.BadRequestException('Gagal menghapus data admin: ' + deleteAdminError.message);
        }
        return { message: 'Admin berhasil dihapus' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map