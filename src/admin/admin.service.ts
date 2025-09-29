import { SupabaseService } from '@/supabase/supabase.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import dayjs from 'dayjs';
import 'dayjs/locale/id';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(customParseFormat);
dayjs.locale('id');
dayjs.extend(isoWeek);

import { LoginAdminDto } from '@/admin/dto/login-admin.dto';
import { ResetPasswordAdminDto } from '@/admin/dto/reset-password-admin.dto';
import { UpdateProfileAdminDto } from '@/admin/dto/update-profile-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly supabaseService: SupabaseService) {}

  //*** Fungsi login admin ***
  async loginAdmin(dto: LoginAdminDto) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Login ke Supabase Auth ***
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (loginError || !loginData.session) {
      throw new UnauthorizedException(
        `Login gagal: ${loginError?.message || 'Email atau password salah'}`,
      );
    }

    let session = loginData.session;
    const user = loginData.user;

    //*** Langkah 3: Perpanjang masa berlaku token ***
    try {
      const { data: refreshedData, error: refreshError } =
        await supabase.auth.refreshSession();
      if (!refreshError && refreshedData?.session) {
        session = refreshedData.session;
      }

      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    } catch (refreshErr) {
      console.error('Gagal memperpanjang session:', refreshErr);
    }

    //*** Langkah 4: Ambil data admin dari tabel Admin ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select(
        'ID_Admin, Peran, Nama_Depan_Admin, Nama_Belakang_Admin, Email_Admin',
      )
      .eq('Email_Admin', dto.email)
      .single();

    if (adminError || !adminData) {
      throw new BadRequestException(
        `Gagal ambil data admin: ${adminError?.message}`,
      );
    }

    //*** Langkah 5: Return response ***
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

  //*** Fungsi untuk mereset password admin dengan memasukan email dan password baru ***
  async resetPasswordAdmin(dto: ResetPasswordAdminDto) {
    //*** Langkah 1: Dapatkan client Supabase Admin ***
    const supabaseAdmin = this.supabaseService.getAdminClient();

    //*** Langkah 2: Cari user berdasarkan email ***
    const { data: users, error: userError } =
      await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000,
      });
    if (userError) {
      throw new BadRequestException(`Gagal mencari user: ${userError.message}`);
    }
    const user = users?.users?.find((u: any) => u.email === dto.email);
    if (!user || !user.id) {
      throw new BadRequestException(
        `User dengan email ${dto.email} tidak ditemukan`,
      );
    }
    const userId = user.id;
    //*** Langkah 3: Update password user melalui Supabase Admin ***
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: dto.newPassword,
      });
    if (updateError) {
      throw new BadRequestException(
        `Gagal memperbarui password: ${updateError.message}`,
      );
    }
    //*** Langkah 4: Kembalikan response ***
    return {
      message: 'Password berhasil direset',
      email: dto.email,
    };
  }

  //*** Fungsi untuk mendapatkan profil admin ***
  async getProfileAdmin(user_id: string, access_token: string) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Verifikasi token Supabase ***
    const { data: userData, error: userError } =
      await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      throw new UnauthorizedException(
        `Token tidak valid atau sudah kedaluwarsa`,
      );
    }

    //*** Langkah 3: Query data admin dari tabel Admin + relasi Stasiun ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select(
        `
        ID_Admin, 
        Email_Admin, 
        Nama_Depan_Admin, 
        Nama_Belakang_Admin, 
        Peran,
        Foto_Admin, 
        ID_Stasiun,
        Stasiun:ID_Stasiun(Nama_Stasiun)
      `,
      )
      .eq('ID_Admin', user_id)
      .single();

    if (adminError) {
      console.error('Admin data fetch error:', adminError);
      throw new BadRequestException('Failed to fetch admin data');
    }

    if (!adminData) {
      throw new NotFoundException('Admin not found');
    }

    //*** Langkah 4: Transformasi data admin ***
    const transformedData = {
      user_id: adminData.ID_Admin,
      email: adminData.Email_Admin,
      nama_depan: adminData.Nama_Depan_Admin,
      nama_belakang: adminData.Nama_Belakang_Admin,
      peran: adminData.Peran,
      foto: adminData.Foto_Admin,
      stasiun_id: adminData.ID_Stasiun,
      stasiun:
        adminData.Stasiun && adminData.Stasiun.length > 0
          ? adminData.Stasiun[0].Nama_Stasiun
          : null,
    };

    //*** Langkah 5: Kembalikan response ***
    return {
      message: 'Profil admin berhasil diambil',
      data: transformedData,
    };
  }

  //*** fungsi untuk menghapus foto lama dari storage Supabase ***
  private async deleteOldPhoto(fileUrl: string) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Hapus file dari storage Supabase ***
    try {
      const path = fileUrl.split('/').pop();
      if (!path) {
        console.warn('Gagal menghapus foto lama: path tidak ditemukan');
        return;
      }
      await supabase.storage.from('foto-admin').remove([path]);
    } catch (err) {
      console.warn('Gagal menghapus foto lama:', err.message);
    }
  }

  //*** Fungsi untuk memperbarui profil admin ***
  async updateProfileAdmin(
    dto: UpdateProfileAdminDto,
    foto?: Express.Multer.File,
  ) {
    //*** Langkah 1: Dapatkan client Supabase dan Admin ***
    const supabase = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdminClient();

    //*** Ekstrak data dari DTO ***
    const { access_token, user_id, nama_depan, nama_belakang, password } = dto;

    //*** Langkah 2: Verifikasi token ***
    const { data: userData, error: userError } =
      await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }

    const updatedFields: string[] = [];
    let fotoUrl: string | null = null;

    //*** Langkah 3: Update password (jika ada) ***
    if (password) {
      if (!user_id) {
        throw new BadRequestException('User ID is required to update password');
      }
      const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
        user_id,
        { password },
      );
      if (pwError) {
        throw new BadRequestException(
          `Gagal memperbarui password: ${pwError.message}`,
        );
      }
      updatedFields.push('password');
    }

    //*** Langkah 4: Upload foto (jika ada) ***
    if (foto) {
      // Validate file
      if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
        throw new BadRequestException('Format file harus JPG atau PNG');
      }
      if (foto.size > 2 * 1024 * 1024) {
        throw new BadRequestException('Ukuran file maksimal 2MB');
      }

      // Ambil foto lama untuk dihapus
      const { data: oldData } = await supabase
        .from('Admin')
        .select('Foto_Admin')
        .eq('ID_Admin', user_id)
        .single();

      if (oldData?.Foto_Admin) {
        await this.deleteOldPhoto(oldData.Foto_Admin);
      }

      // Upload foto baru
      const fileExt = foto.originalname.split('.').pop();
      const fileName = `${user_id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('foto-admin')
        .upload(fileName, foto.buffer, {
          contentType: foto.mimetype,
          upsert: true,
        });

      if (uploadError) {
        throw new BadRequestException(
          `Gagal upload foto: ${uploadError.message}`,
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('foto-admin').getPublicUrl(fileName);

      fotoUrl = publicUrl;
      updatedFields.push('foto');
    }

    //*** Langkah 5: Ambil data lama Admin ***
    const { data: existingAdmin, error: existingError } = await supabase
      .from('Admin')
      .select('*')
      .eq('ID_Admin', user_id)
      .single();

    if (existingError || !existingAdmin) {
      throw new BadRequestException(
        `Gagal ambil data admin: ${existingError?.message}`,
      );
    }

    //*** Langkah 6: Update tabel Admin ***
    const updatePayload: any = {};
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

    let updatedAdmin: any = null;
    if (Object.keys(updatePayload).length > 0) {
      const { data, error: updateError } = await supabase
        .from('Admin')
        .update(updatePayload)
        .eq('ID_Admin', user_id)
        .select()
        .single();

      if (updateError) {
        throw new BadRequestException(
          `Gagal update data admin: ${updateError.message}`,
        );
      }
      updatedAdmin = data;
    }

    //*** Langkah 7: Transformasi data untuk response ***
    const transformedData = {
      user_id: user_id,
      email: existingAdmin.Email_Admin,
      nama_depan:
        updatedAdmin?.Nama_Depan_Admin || existingAdmin.Nama_Depan_Admin,
      nama_belakang:
        updatedAdmin?.Nama_Belakang_Admin || existingAdmin.Nama_Belakang_Admin,
      peran: existingAdmin.Peran,
      foto: updatedAdmin?.Foto_Admin || existingAdmin.Foto_Admin,
      stasiun_id: existingAdmin.ID_Stasiun,
    };

    //*** Langkah 8: Kembalikan response ***
    return {
      message: 'Profil admin berhasil diperbarui',
      updatedFields,
      data: transformedData,
    };
  }

  //*** Fungsi untuk mendapatkan data dashboard admin ***
  async getDashboard(user_id: string, access_token: string) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    // *** Langkah 2: Verifikasi token Supabase ***
    const { data: userData, error: userError } =
      await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }

    // *** Langkah 3: Ambil data admin dari tabel Admin ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select('Peran, ID_Stasiun')
      .eq('ID_Admin', user_id)
      .single();

    if (adminError || !adminData) {
      throw new UnauthorizedException('Admin tidak ditemukan');
    }

    const isSuperadmin = adminData.Peran === 'Superadmin';

    // *** Langkah 4: Hitung jumlah data Buku Tamu ***
    let bukuTamuQuery = supabase
      .from('Buku_Tamu')
      .select('ID_Buku_Tamu', { count: 'exact', head: true });

    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak memiliki ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    }

    //*** Langkah 5: Eksekusi query dan kembalikan response ***
    const { count, error: bukuTamuError } = await bukuTamuQuery;
    if (bukuTamuError) {
      throw new BadRequestException(
        `Gagal menghitung data Buku Tamu: ${bukuTamuError.message}`,
      );
    }

    //*** Langkah 6: Kembalikan response ***
    return {
      peran: adminData.Peran,
      id_stasiun: adminData.ID_Stasiun || null,
      jumlah_tamu: count || 0,
    };
  }

  //*** Fungsi untuk mendapatkan data Buku Tamu dengan filter periode dan stasiun ***
  async getBukuTamu(
    access_token: string,
    user_id: string,
    period?: 'today' | 'week' | 'month',
    startDate?: string,
    endDate?: string,
    filterStasiunId?: string,
  ) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Verifikasi token ***
    const { data: userData, error: userError } =
      await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }

    //*** Langkah 3: Ambil data admin ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select('ID_Admin, Peran, ID_Stasiun')
      .eq('ID_Admin', user_id)
      .single();

    if (adminError || !adminData) {
      throw new BadRequestException(
        `Admin tidak ditemukan: ${adminError?.message}`,
      );
    }

    const isSuperadmin = adminData.Peran === 'Superadmin';

    //*** Langkah 4: Validasi filterStasiunId ***
    if (!isSuperadmin && filterStasiunId) {
      throw new ForbiddenException(
        'Anda tidak memiliki izin untuk memfilter berdasarkan ID Stasiun',
      );
    }

    //*** Langkah 5: Build query dengan relasi Stasiun ***
    let bukuTamuQuery = supabase
      .from('Buku_Tamu')
      .select(
        `
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
    `,
      )
      .order('Waktu_Pengisian', { ascending: false });

    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak memiliki ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    } else if (filterStasiunId) {
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', filterStasiunId);
    }

    //*** Langkah 6: Filter berdasarkan period ***
    const today = dayjs().startOf('day');
    if (period === 'today') {
      bukuTamuQuery = bukuTamuQuery.gte('Waktu_Kunjungan', today.toISOString());
    } else if (period === 'week') {
      const startOfWeek = today.startOf('week');
      bukuTamuQuery = bukuTamuQuery.gte(
        'Waktu_Kunjungan',
        startOfWeek.toISOString(),
      );
    } else if (period === 'month') {
      const startOfMonth = today.startOf('month');
      bukuTamuQuery = bukuTamuQuery.gte(
        'Waktu_Kunjungan',
        startOfMonth.toISOString(),
      );
    }

    //*** Langkah 7: Filter berdasarkan custom date range ***
    if (startDate && endDate) {
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', dayjs(startDate).toISOString())
        .lte('Waktu_Kunjungan', dayjs(endDate).toISOString());
    }

    //*** Langkah 8: Eksekusi query ***
    const { data: bukuTamuData, error: bukuTamuError } = await bukuTamuQuery;
    if (bukuTamuError) {
      throw new BadRequestException(
        `Gagal ambil data Buku_Tamu: ${bukuTamuError.message}`,
      );
    }

    //*** Langkah 9: Format hasil ***
    const formattedData = bukuTamuData.map((item) => ({
      ...item,
      Waktu_Kunjungan: dayjs(item.Waktu_Kunjungan).format(
        'dddd, D MMMM YYYY, HH.mm',
      ),
    }));

    //*** Langkah 10: Kembalikan response lengkap ***
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

  //*** Fungsi helper untuk mendapatkan data Buku Tamu berdasarkan periode tertentu (hari ini, minggu ini, bulan ini) ***
  private async getBukuTamuByPeriod(
    access_token: string,
    user_id: string,
    period: 'today' | 'week' | 'month',
  ) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    // *** Langkah 2: Verifikasi token Supabase ***
    const { data: userData, error: userError } =
      await supabase.auth.getUser(access_token);
    if (userError || !userData?.user) {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }

    //*** Langkah 3: Ambil data admin dari tabel Admin ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select('*')
      .eq('ID_Admin', user_id)
      .single();

    if (adminError || !adminData) {
      throw new NotFoundException('Data admin tidak ditemukan');
    }

    const isSuperadmin = adminData.Peran === 'Superadmin';

    // Buat query dasar
    let bukuTamuQuery = supabase.from('Buku_Tamu').select(`
    *,
    Stasiun:ID_Stasiun (
      ID_Stasiun,
      Nama_Stasiun
    )
  `);

    //***  Langkah 4: Tambahkan Filter berdasarkan period (menggunakan kolom Waktu_Kunjungan) ***
    const today = new Date();
    if (period === 'today') {
      const start = new Date(today.setHours(0, 0, 0, 0));
      const end = new Date(today.setHours(23, 59, 59, 999));
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', start.toISOString())
        .lte('Waktu_Kunjungan', end.toISOString());
    } else if (period === 'week') {
      const start = dayjs().startOf('week').toDate();
      const end = dayjs().endOf('week').toDate();
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', start.toISOString())
        .lte('Waktu_Kunjungan', end.toISOString());
    } else if (period === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', start.toISOString())
        .lte('Waktu_Kunjungan', end.toISOString());
    }

    // Filter kalau admin biasa
    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak memiliki ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    }

    const { data, error } = await bukuTamuQuery;

    if (error) {
      throw new BadRequestException(
        `Gagal mengambil data Buku Tamu: ${error.message}`,
      );
    }

    //*** Langkah 5: Format hasil dan kembalikan response ***
    const formattedData =
      data?.map((item) => ({
        ...item,
        Waktu_Kunjungan: dayjs(item.Waktu_Kunjungan).format(
          'dddd, D MMMM YYYY, HH.mm',
        ),
      })) || [];

    //*** Langkah 6: Kembalikan response ***
    return {
      period,
      isSuperadmin,
      stationFilter: !isSuperadmin ? adminData.ID_Stasiun : 'all',
      count: formattedData.length,
      data: formattedData,
    };
  }

  //*** Fungsi untuk mendapatkan data Buku Tamu hari ini ***
  async getBukuTamuHariIni(access_token: string, user_id: string) {
    return this.getBukuTamuByPeriod(access_token, user_id, 'today');
  }

  //*** Fungsi untuk mendapatkan data Buku Tamu minggu ini ***
  async getBukuTamuMingguIni(access_token: string, user_id: string) {
    return this.getBukuTamuByPeriod(access_token, user_id, 'week');
  }

  //*** Fungsi untuk mendapatkan data Buku Tamu bulan ini ***
  async getBukuTamuBulanIni(access_token: string, user_id: string) {
    return this.getBukuTamuByPeriod(access_token, user_id, 'month');
  }
}
