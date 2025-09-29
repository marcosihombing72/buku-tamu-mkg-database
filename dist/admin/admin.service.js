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
        try {
            const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
            if (!refreshError && refreshedData?.session) {
                session = refreshedData.session;
            }
            await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            });
        }
        catch (refreshErr) {
            console.error('Gagal memperpanjang session:', refreshErr);
        }
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
    async getProfileAdmin(user_id, access_token) {
        const supabase = this.supabaseService.getClient();
        const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            throw new common_1.UnauthorizedException(`Token tidak valid atau sudah kedaluwarsa`);
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
        Stasiun:ID_Stasiun(Nama_Stasiun)
      `)
            .eq('ID_Admin', user_id)
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
            stasiun: adminData.Stasiun && adminData.Stasiun.length > 0
                ? adminData.Stasiun[0].Nama_Stasiun
                : null,
        };
        return {
            message: 'Profil admin berhasil diambil',
            data: transformedData,
        };
    }
    async deleteOldPhoto(fileUrl) {
        const supabase = this.supabaseService.getClient();
        try {
            const path = fileUrl.split('/').pop();
            if (!path) {
                console.warn('Gagal menghapus foto lama: path tidak ditemukan');
                return;
            }
            await supabase.storage.from('foto-admin').remove([path]);
        }
        catch (err) {
            console.warn('Gagal menghapus foto lama:', err.message);
        }
    }
    async updateProfileAdmin(dto, foto) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { access_token, user_id, nama_depan, nama_belakang, password } = dto;
        const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            throw new common_1.UnauthorizedException('Token tidak valid atau sudah kedaluwarsa');
        }
        const updatedFields = [];
        let fotoUrl = null;
        if (password) {
            if (!user_id) {
                throw new common_1.BadRequestException('User ID is required to update password');
            }
            const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password });
            if (pwError) {
                throw new common_1.BadRequestException(`Gagal memperbarui password: ${pwError.message}`);
            }
            updatedFields.push('password');
        }
        if (foto) {
            if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
                throw new common_1.BadRequestException('Format file harus JPG atau PNG');
            }
            if (foto.size > 2 * 1024 * 1024) {
                throw new common_1.BadRequestException('Ukuran file maksimal 2MB');
            }
            const { data: oldData } = await supabase
                .from('Admin')
                .select('Foto_Admin')
                .eq('ID_Admin', user_id)
                .single();
            if (oldData?.Foto_Admin) {
                await this.deleteOldPhoto(oldData.Foto_Admin);
            }
            const fileExt = foto.originalname.split('.').pop();
            const fileName = `${user_id}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('foto-admin')
                .upload(fileName, foto.buffer, {
                contentType: foto.mimetype,
                upsert: true,
            });
            if (uploadError) {
                throw new common_1.BadRequestException(`Gagal upload foto: ${uploadError.message}`);
            }
            const { data: { publicUrl }, } = supabase.storage.from('foto-admin').getPublicUrl(fileName);
            fotoUrl = publicUrl;
            updatedFields.push('foto');
        }
        const { data: existingAdmin, error: existingError } = await supabase
            .from('Admin')
            .select('*')
            .eq('ID_Admin', user_id)
            .single();
        if (existingError || !existingAdmin) {
            throw new common_1.BadRequestException(`Gagal ambil data admin: ${existingError?.message}`);
        }
        const updatePayload = {};
        if (nama_depan) {
            updatePayload.Nama_Depan_Admin = nama_depan;
            updatedFields.push('nama_depan');
        }
        if (nama_belakang) {
            updatePayload.Nama_Belakang_Admin = nama_belakang;
            updatedFields.push('nama_belakang');
        }
        if (fotoUrl) {
            updatePayload.Foto_Admin = fotoUrl;
        }
        let updatedAdmin = null;
        if (Object.keys(updatePayload).length > 0) {
            const { data, error: updateError } = await supabase
                .from('Admin')
                .update(updatePayload)
                .eq('ID_Admin', user_id)
                .select()
                .single();
            if (updateError) {
                throw new common_1.BadRequestException(`Gagal update data admin: ${updateError.message}`);
            }
            updatedAdmin = data;
        }
        const transformedData = {
            user_id: user_id,
            email: existingAdmin.Email_Admin,
            nama_depan: updatedAdmin?.Nama_Depan_Admin || existingAdmin.Nama_Depan_Admin,
            nama_belakang: updatedAdmin?.Nama_Belakang_Admin || existingAdmin.Nama_Belakang_Admin,
            peran: existingAdmin.Peran,
            foto: updatedAdmin?.Foto_Admin || existingAdmin.Foto_Admin,
            stasiun_id: existingAdmin.ID_Stasiun,
        };
        return {
            message: 'Profil admin berhasil diperbarui',
            updatedFields,
            data: transformedData,
        };
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
        const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            throw new common_1.UnauthorizedException('Token tidak valid atau sudah kedaluwarsa');
        }
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select('ID_Admin, Peran, ID_Stasiun')
            .eq('ID_Admin', user_id)
            .single();
        if (adminError || !adminData) {
            throw new common_1.BadRequestException(`Admin tidak ditemukan: ${adminError?.message}`);
        }
        const isSuperadmin = adminData.Peran === 'Superadmin';
        if (!isSuperadmin && filterStasiunId) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin untuk memfilter berdasarkan ID Stasiun');
        }
        let bukuTamuQuery = supabase
            .from('Buku_Tamu')
            .select(`
      ID_Buku_Tamu,
      ID_Pengunjung,
      ID_Stasiun,
      Tujuan,
      Tanggal_Pengisian,
      Waktu_Kunjungan,
      Tanda_Tangan,
      Nama_Depan_Pengunjung,
      Nama_Belakang_Pengunjung,
      Email_Pengunjung,
      No_Telepon_Pengunjung,
      Asal_Pengunjung,
      Asal_Instansi,
      Stasiun:ID_Stasiun(Nama_Stasiun)
    `)
            .order('Waktu_Pengisian', { ascending: false });
        if (!isSuperadmin) {
            if (!adminData.ID_Stasiun) {
                throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
            }
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
        }
        else if (filterStasiunId) {
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', filterStasiunId);
        }
        const today = (0, dayjs_1.default)().startOf('day');
        if (period === 'today') {
            bukuTamuQuery = bukuTamuQuery.gte('Waktu_Kunjungan', today.toISOString());
        }
        else if (period === 'week') {
            const startOfWeek = today.startOf('week');
            bukuTamuQuery = bukuTamuQuery.gte('Waktu_Kunjungan', startOfWeek.toISOString());
        }
        else if (period === 'month') {
            const startOfMonth = today.startOf('month');
            bukuTamuQuery = bukuTamuQuery.gte('Waktu_Kunjungan', startOfMonth.toISOString());
        }
        if (startDate && endDate) {
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', (0, dayjs_1.default)(startDate).toISOString())
                .lte('Waktu_Kunjungan', (0, dayjs_1.default)(endDate).toISOString());
        }
        const { data: bukuTamuData, error: bukuTamuError } = await bukuTamuQuery;
        if (bukuTamuError) {
            throw new common_1.BadRequestException(`Gagal ambil data Buku_Tamu: ${bukuTamuError.message}`);
        }
        const formattedData = bukuTamuData.map((item) => ({
            ...item,
            Waktu_Kunjungan: (0, dayjs_1.default)(item.Waktu_Kunjungan).format('dddd, D MMMM YYYY, HH.mm'),
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
        const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            throw new common_1.UnauthorizedException('Token tidak valid atau sudah kedaluwarsa');
        }
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select('*')
            .eq('ID_Admin', user_id)
            .single();
        if (adminError || !adminData) {
            throw new common_1.NotFoundException('Data admin tidak ditemukan');
        }
        const isSuperadmin = adminData.Peran === 'Superadmin';
        let bukuTamuQuery = supabase.from('Buku_Tamu').select(`
    *,
    Stasiun:ID_Stasiun (
      ID_Stasiun,
      Nama_Stasiun
    )
  `);
        const today = new Date();
        if (period === 'today') {
            const start = new Date(today.setHours(0, 0, 0, 0));
            const end = new Date(today.setHours(23, 59, 59, 999));
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', start.toISOString())
                .lte('Waktu_Kunjungan', end.toISOString());
        }
        else if (period === 'week') {
            const start = (0, dayjs_1.default)().startOf('week').toDate();
            const end = (0, dayjs_1.default)().endOf('week').toDate();
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', start.toISOString())
                .lte('Waktu_Kunjungan', end.toISOString());
        }
        else if (period === 'month') {
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', start.toISOString())
                .lte('Waktu_Kunjungan', end.toISOString());
        }
        if (!isSuperadmin) {
            if (!adminData.ID_Stasiun) {
                throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
            }
            bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map