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
const fs_1 = require("fs");
const path_1 = require("path");
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
        const session = loginData.session;
        const user = loginData.user;
        await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        });
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { data: adminData, error: adminError } = await supabaseAdmin
            .from('Admin')
            .select('ID_Admin, Peran, Nama_Depan_Admin, Nama_Belakang_Admin, Email_Admin, ID_Stasiun')
            .eq('Email_Admin', dto.email)
            .single();
        if (adminError || !adminData) {
            throw new common_1.BadRequestException(`Gagal ambil data admin: ${adminError?.message || 'Data admin tidak ditemukan'}`);
        }
        const { ID_Stasiun, Peran } = adminData;
        if (ID_Stasiun) {
            const { data: stasiunData, error: stasiunError } = await supabaseAdmin
                .from('Stasiun')
                .select('ID_Stasiun')
                .eq('ID_Stasiun', ID_Stasiun)
                .single();
            if (stasiunError || !stasiunData) {
                throw new common_1.BadRequestException(`ID_Stasiun tidak valid atau tidak ditemukan di tabel Stasiun.`);
            }
            if (Peran !== 'Admin') {
                throw new common_1.BadRequestException(`Peran tidak sesuai. Akun dengan ID_Stasiun harus berperan sebagai Admin.`);
            }
        }
        else {
            if (Peran !== 'Superadmin') {
                throw new common_1.BadRequestException(`Peran tidak sesuai. Akun tanpa ID_Stasiun harus berperan sebagai Superadmin.`);
            }
        }
        return {
            message: 'Login berhasil',
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            user_id: user.id,
            peran: adminData.Peran,
            nama_depan: adminData.Nama_Depan_Admin,
            nama_belakang: adminData.Nama_Belakang_Admin,
            id_stasiun: adminData.ID_Stasiun,
            expires_at: session.expires_at,
        };
    }
    async resetPasswordAdmin(dto) {
        const supabaseAdmin = this.supabaseService.getAdminClient();
        if (!dto.email || !dto.newPassword) {
            throw new common_1.BadRequestException('Email dan password baru wajib diisi');
        }
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) {
            throw new common_1.BadRequestException(`Gagal mencari user: ${listError.message}`);
        }
        const user = listData.users.find((u) => u.email === dto.email);
        if (!user || !user.id) {
            throw new common_1.BadRequestException(`User dengan email ${dto.email} tidak ditemukan`);
        }
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
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
    async getProfile(user_id) {
        const supabase = this.supabaseService.getClient();
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
            .eq('ID_Admin', user_id)
            .single();
        if (adminError) {
            console.error('Admin data fetch error:', adminError);
            throw new common_1.BadRequestException('Gagal mengambil data admin');
        }
        if (!adminData) {
            throw new common_1.NotFoundException('Data admin tidak ditemukan');
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
            message: 'Profil admin berhasil diambil',
            data: transformedData,
        };
    }
    async updateProfile(user, user_id, dto, foto) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const userId = user.id;
        const { data: existingAdmin, error: adminError } = await supabase
            .from('Admin')
            .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
            .eq('ID_Admin', userId)
            .single();
        if (adminError || !existingAdmin) {
            throw new common_1.BadRequestException('Data admin tidak ditemukan');
        }
        let fotoUrl = existingAdmin.Foto_Admin;
        let uploadedFileName = null;
        const updatedFields = [];
        try {
            if (foto) {
                if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
                    throw new common_1.BadRequestException('Format file harus JPG atau PNG');
                }
                if (foto.size > 10 * 1024 * 1024) {
                    throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
                }
                const fileExt = foto.originalname.split('.').pop();
                uploadedFileName = `${user_id}_${crypto.randomUUID()}.${fileExt}`;
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
            if (dto.password) {
                if (dto.password !== dto.confirmPassword) {
                    throw new common_1.BadRequestException('Konfirmasi password tidak cocok');
                }
                const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
                    password: dto.password,
                });
                if (pwError) {
                    throw new common_1.BadRequestException('Gagal memperbarui password');
                }
                updatedFields.push('password');
            }
            const updatePayload = {};
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
            return {
                message: updatedFields.length > 0
                    ? 'Profil admin berhasil diperbarui'
                    : 'Tidak ada perubahan yang dilakukan',
                data: {
                    nama_depan: updatedAdmin?.Nama_Depan_Admin || existingAdmin.Nama_Depan_Admin,
                    nama_belakang: updatedAdmin?.Nama_Belakang_Admin ||
                        existingAdmin.Nama_Belakang_Admin,
                    foto: updatedAdmin?.Foto_Admin || existingAdmin.Foto_Admin,
                },
                updated_fields: updatedFields,
            };
        }
        catch (error) {
            if (uploadedFileName) {
                await supabase.storage
                    .from('foto-admin')
                    .remove([uploadedFileName])
                    .catch((cleanupError) => console.error('Gagal hapus foto baru:', cleanupError));
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
    async getBukuTamu(user, user_id, period, startDate, endDate, filterStasiunId) {
        const supabase = this.supabaseService.getClient();
        const userId = user.id;
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select(`ID_Admin, Peran, ID_Stasiun`)
            .eq('ID_Admin', userId)
            .single();
        if (adminError) {
            console.error('Admin data fetch error:', adminError);
            throw new common_1.BadRequestException('Gagal mengambil data admin');
        }
        if (!adminData)
            throw new common_1.NotFoundException('Admin tidak ditemukan');
        const isSuperadmin = adminData.Peran === 'Superadmin';
        if (!isSuperadmin && filterStasiunId) {
            throw new common_1.ForbiddenException('Anda tidak boleh filter berdasarkan ID Stasiun');
        }
        let bukuTamuQuery = supabase
            .from('Buku_Tamu')
            .select(`
      ID_Buku_Tamu,
      ID_Pengunjung,
      ID_Stasiun,
      Tujuan,
      Waktu_Kunjungan,
      Tanda_Tangan,
      Pengunjung:ID_Pengunjung!inner(
        Nama_Depan_Pengunjung,
        Nama_Belakang_Pengunjung,
        Email_Pengunjung,
        No_Telepon_Pengunjung,
        Asal_Pengunjung,
        Asal_Instansi,
        Alamat_Lengkap
      ),
      Stasiun:ID_Stasiun!inner(Nama_Stasiun)
    `)
            .order('Waktu_Kunjungan', { ascending: false });
        if (!isSuperadmin) {
            if (!adminData.ID_Stasiun)
                throw new common_1.BadRequestException('Admin tidak memiliki ID_Stasiun');
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
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', now.startOf('week').toISOString())
                .lte('Waktu_Kunjungan', now.endOf('week').toISOString());
        }
        else if (period === 'month') {
            bukuTamuQuery = bukuTamuQuery
                .gte('Waktu_Kunjungan', now.startOf('month').toISOString())
                .lte('Waktu_Kunjungan', now.endOf('month').toISOString());
        }
        const { data: bukuTamuData, error: bukuTamuError } = (await bukuTamuQuery);
        if (bukuTamuError) {
            console.error('Buku Tamu query error:', bukuTamuError);
            throw new common_1.BadRequestException('Gagal mengambil data Buku Tamu');
        }
        const formattedData = (bukuTamuData || []).map((item) => ({
            ID_Buku_Tamu: item.ID_Buku_Tamu,
            ID_Stasiun: item.ID_Stasiun,
            Tujuan: item.Tujuan,
            Waktu_Kunjungan: (0, dayjs_1.default)(item.Waktu_Kunjungan).format('dddd, D MMMM YYYY, HH.mm'),
            Tanda_Tangan: item.Tanda_Tangan,
            Nama_Depan_Pengunjung: item.Pengunjung?.Nama_Depan_Pengunjung ?? null,
            Nama_Belakang_Pengunjung: item.Pengunjung?.Nama_Belakang_Pengunjung ?? null,
            Email_Pengunjung: item.Pengunjung?.Email_Pengunjung ?? null,
            No_Telepon_Pengunjung: item.Pengunjung?.No_Telepon_Pengunjung ?? null,
            Asal_Pengunjung: item.Pengunjung?.Asal_Pengunjung ?? null,
            Asal_Instansi: item.Pengunjung?.Asal_Instansi ?? null,
            Alamat_Lengkap: item.Pengunjung?.Alamat_Lengkap ?? null,
            Nama_Stasiun: item.Stasiun?.Nama_Stasiun ?? null,
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
    async getBukuTamuByPeriod(user, user_id, period) {
        const supabase = this.supabaseService.getClient();
        const userId = user.id;
        const { data: adminData, error: adminError } = await supabase
            .from('Admin')
            .select('Peran, ID_Stasiun')
            .eq('ID_Admin', userId)
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
      Pengunjung:ID_Pengunjung(
        Nama_Depan_Pengunjung,
        Nama_Belakang_Pengunjung,
        Email_Pengunjung,
        No_Telepon_Pengunjung,
        Asal_Pengunjung,
        Asal_Instansi,
        Alamat_Lengkap
      ),
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
    async getBukuTamuHariIni(user, user_id) {
        return this.getBukuTamuByPeriod(user, user_id, 'today');
    }
    async getBukuTamuMingguIni(user, user_id) {
        return this.getBukuTamuByPeriod(user, user_id, 'week');
    }
    async getBukuTamuBulanIni(user, user_id) {
        return this.getBukuTamuByPeriod(user, user_id, 'month');
    }
    async getAllAdmins(user, user_id, search, filterPeran, filterStasiunId) {
        const supabase = this.supabaseService.getClient();
        const userId = user.id;
        const { data: currentAdmin, error: currentAdminError } = await supabase
            .from('Admin')
            .select('Peran, ID_Stasiun')
            .eq('ID_Admin', userId)
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
    async createAdmin(body, foto, user, user_id) {
        const { nama_depan, nama_belakang, email, password, confirmPassword, peran, id_stasiun, } = body;
        if (!nama_depan || !email || !password || !confirmPassword || !peran) {
            throw new common_1.BadRequestException('Semua field wajib diisi (kecuali opsional)');
        }
        if (!['Admin', 'Superadmin'].includes(peran)) {
            throw new common_1.BadRequestException('Peran tidak valid (hanya Admin / Superadmin)');
        }
        if (password.length < 6) {
            throw new common_1.BadRequestException('Password minimal 6 karakter');
        }
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException('Konfirmasi password tidak cocok');
        }
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const { data: roleCheck, error: roleError } = await supabase
            .from('Admin')
            .select('Peran')
            .eq('ID_Admin', user_id)
            .single();
        if (roleError || !roleCheck || roleCheck.Peran !== 'Superadmin') {
            throw new common_1.ForbiddenException('Hanya Superadmin yang dapat menambahkan admin baru');
        }
        const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (createUserError) {
            throw new common_1.BadRequestException('Gagal membuat user baru: ' + createUserError.message);
        }
        const newUserId = newUser.user.id;
        let fotoUrl;
        if (foto) {
            if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
                throw new common_1.BadRequestException('Format file harus JPG atau PNG');
            }
            if (foto.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException('Ukuran file maksimal 10MB');
            }
            const fileExt = foto.originalname.split('.').pop();
            const uniqueId = (0, crypto_1.randomUUID)();
            const uploadedFileName = `${newUserId}_${uniqueId}.${fileExt}`;
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
        }
        else {
            const defaultPath = (0, path_1.join)(process.cwd(), 'src', 'public', 'Logo_BMKG.png');
            const fileBuffer = (0, fs_1.readFileSync)(defaultPath);
            const uniqueId = (0, crypto_1.randomUUID)();
            const uploadedFileName = `${newUserId}_${uniqueId}.png`;
            const { error: uploadError } = await supabase.storage
                .from('foto-admin')
                .upload(uploadedFileName, fileBuffer, {
                contentType: 'image/png',
                upsert: true,
            });
            if (uploadError) {
                throw new common_1.BadRequestException('Gagal mengunggah foto default');
            }
            fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/foto-admin/${uploadedFileName}`;
        }
        const { error: insertError } = await supabase.from('Admin').insert([
            {
                ID_Admin: newUserId,
                Peran: peran,
                ID_Stasiun: peran === 'Admin' ? id_stasiun : null,
                Created_At: new Date().toISOString(),
                Nama_Depan_Admin: nama_depan,
                Nama_Belakang_Admin: nama_belakang || null,
                Email_Admin: email,
                Foto_Admin: fotoUrl,
            },
        ]);
        if (insertError) {
            throw new common_1.BadRequestException('Gagal menyimpan data admin: ' + insertError.message);
        }
        return {
            message: 'Admin berhasil dibuat',
            id: newUserId,
            email,
            peran,
        };
    }
    async updateAdmin(user, id_admin, dto, user_id) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const userId = user.id;
        const { data: currentAdmin, error: currentError } = await supabase
            .from('Admin')
            .select('Peran')
            .eq('ID_Admin', userId)
            .single();
        if (currentError || !currentAdmin) {
            throw new common_1.UnauthorizedException('Data admin tidak ditemukan');
        }
        const isSuperadmin = currentAdmin.Peran === 'Superadmin';
        if (!isSuperadmin && user_id !== id_admin) {
            throw new common_1.UnauthorizedException('Tidak diizinkan untuk update admin lain');
        }
        const { data: existingAdmin, error: existingError } = await supabase
            .from('Admin')
            .select('Foto_Admin')
            .eq('ID_Admin', id_admin)
            .single();
        if (existingError) {
            throw new common_1.BadRequestException('Gagal mengambil data admin lama');
        }
        let fotoUrl = existingAdmin?.Foto_Admin || null;
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
        const updatePayload = {
            ...(dto.nama_depan && { Nama_Depan_Admin: dto.nama_depan }),
            ...(dto.nama_belakang && { Nama_Belakang_Admin: dto.nama_belakang }),
            ...(fotoUrl && { Foto_Admin: fotoUrl }),
        };
        const { error: updateError } = await supabase
            .from('Admin')
            .update(updatePayload)
            .eq('ID_Admin', id_admin);
        if (updateError) {
            throw new common_1.BadRequestException('Gagal update data admin: ' + updateError.message);
        }
        return {
            message: 'Admin berhasil diupdate',
            updated_fields: updatePayload,
        };
    }
    async deleteAdmin(user, user_id, id_admin) {
        const supabase = this.supabaseService.getClient();
        const supabaseAdmin = this.supabaseService.getAdminClient();
        const userId = user.id;
        const { data: currentAdmin, error: currentError } = await supabase
            .from('Admin')
            .select('Peran')
            .eq('ID_Admin', user.id)
            .single();
        if (currentError || !currentAdmin) {
            throw new common_1.UnauthorizedException('Data admin login tidak ditemukan');
        }
        if (currentAdmin.Peran !== 'Superadmin') {
            throw new common_1.UnauthorizedException('Hanya Superadmin yang dapat menghapus admin');
        }
        if (user_id === id_admin) {
            throw new common_1.BadRequestException('Tidak dapat menghapus akun sendiri');
        }
        const { data: adminToDelete, error: adminError } = await supabase
            .from('Admin')
            .select('Foto_Admin')
            .eq('ID_Admin', id_admin)
            .single();
        if (adminError || !adminToDelete) {
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