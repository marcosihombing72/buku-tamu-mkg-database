import { SupabaseService } from '@/supabase/supabase.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

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

    //*** Langkah 2: Lakukan login admin ***
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

    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    //*** Langkah 3: Ambil data admin dari tabel Admin ***
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

    //*** Langkah 4: Kembalikan response ***
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
  async getProfile(user_id: string, access_token: string) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Verifikasi token Supabase ***
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(access_token);

    if (error || !user?.id || user.id !== user_id) {
      console.error('Invalid token or mismatch:', {
        error,
        tokenUserId: user?.id,
        requestedUserId: user_id,
      });
      throw new UnauthorizedException('Invalid token or user mismatch');
    }

    //*** Langkah 3: Ambil data admin dari tabel Admin ***
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
      Stasiun (
        Nama_Stasiun
      )
      `,
      )
      .eq('ID_Admin', user.id)
      .single();

    if (adminError) {
      console.error('Admin data fetch error:', adminError);
      throw new BadRequestException('Failed to fetch admin data');
    }

    if (!adminData) {
      throw new NotFoundException('Admin not found');
    }

    //*** Langkah 4: Transformasi data dan kembalikan response ***
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

    //*** Langkah 5: Kembalikan response ***
    return {
      message: 'Admin profile retrieved successfully',
      data: transformedData,
    };
  }

  //*** Fungsi untuk memperbarui profil admin (nama depan, nama belakang, password, foto) ***
  async updateProfile(
    dto: UpdateProfileAdminDto & {
      access_token: string;
      user_id: string;
      confirmPassword?: string;
    },
    foto?: Express.Multer.File,
  ): Promise<any> {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdminClient();

    //*** Langkah 2: Ekstrak data dari DTO ***
    const {
      user_id,
      access_token,
      nama_depan,
      nama_belakang,
      password,
      confirmPassword,
    } = dto;

    //*** Langkah 3: Verifikasi token Supabase ***
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(access_token);

    if (authError || !user?.id || user.id !== user_id) {
      throw new UnauthorizedException('Token tidak valid atau tidak sesuai');
    }

    //*** Langkah 4: Ambil data admin saat ini dari tabel Admin ***
    const { data: existingAdmin, error: adminError } = await supabase
      .from('Admin')
      .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
      .eq('ID_Admin', user_id)
      .single();

    if (adminError || !existingAdmin) {
      throw new BadRequestException('Data admin tidak ditemukan');
    }

    let fotoUrl = existingAdmin.Foto_Admin;
    let uploadedFileName: string | null = null;
    let updatedFields: string[] = [];

    try {
      //*** Langkah 5: Handle foto upload jika ada ***
      if (foto) {
        if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
          throw new BadRequestException('Format file harus JPG atau PNG');
        }
        if (foto.size > 10 * 1024 * 1024) {
          throw new BadRequestException('Ukuran file maksimal 10MB');
        }

        const fileExt = foto.originalname.split('.').pop();
        uploadedFileName = `${user_id}_${randomUUID()}.${fileExt}`;

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
          throw new BadRequestException('Gagal mengunggah foto baru');
        }

        fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/foto-admin/${uploadedFileName}`;
        updatedFields.push('foto');
      }

      //*** Langkah 6: Update password jika ada perubahan ***
      if (password) {
        if (password !== confirmPassword) {
          throw new BadRequestException('Konfirmasi password tidak cocok');
        }

        const { error: pwError } =
          await supabaseAdmin.auth.admin.updateUserById(user_id, { password });
        if (pwError) {
          throw new BadRequestException('Gagal memperbarui password');
        }
        updatedFields.push('password');
      }

      //*** Langkah 7: Update data admin di tabel Admin jika ada perubahan nama atau foto ***
      const updatePayload: Record<string, any> = {};
      if (nama_depan && nama_depan !== existingAdmin.Nama_Depan_Admin) {
        updatePayload.Nama_Depan_Admin = nama_depan;
        updatedFields.push('nama_depan');
      }
      if (
        nama_belakang &&
        nama_belakang !== existingAdmin.Nama_Belakang_Admin
      ) {
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
          throw new BadRequestException('Gagal memperbarui profil admin');
        }
      }

      const { data: updatedAdmin } = await supabase
        .from('Admin')
        .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
        .eq('ID_Admin', user_id)
        .single();

      //*** Langkah 8: Transformasi data***
      const transformedData = {
        nama_depan:
          updatedAdmin?.Nama_Depan_Admin || existingAdmin.Nama_Depan_Admin,
        nama_belakang:
          updatedAdmin?.Nama_Belakang_Admin ||
          existingAdmin.Nama_Belakang_Admin,
        foto: updatedAdmin?.Foto_Admin || existingAdmin.Foto_Admin,
      };

      //*** Langkah 9: Kembalikan response ***
      return {
        message:
          updatedFields.length > 0
            ? 'Profil admin berhasil diperbarui'
            : 'Tidak ada perubahan yang dilakukan',
        data: transformedData,
        updated_fields: updatedFields,
      };
    } catch (error) {
      if (uploadedFileName) {
        await supabase.storage
          .from('foto-admin')
          .remove([uploadedFileName])
          .catch((cleanupError) => {
            console.error(
              'Gagal menghapus foto yang baru diupload:',
              cleanupError,
            );
          });
      }
      throw error;
    }
  }

  //*** Fungsi untuk menghapus foto lama dari storage Supabase ***
  private async deleteOldPhoto(fotoUrl: string): Promise<void> {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();
    //*** Langkah 2: Hapus file dari storage Supabase ***
    try {
      if (!fotoUrl) return; // kalau kosong, skip

      const oldFileName = fotoUrl.split('/').pop();

      if (oldFileName) {
        const { error } = await supabase.storage
          .from('foto-admin')
          .remove([oldFileName]);

        if (error) {
          console.error('Gagal menghapus foto lama:', error.message);
        }
      }
    } catch (err) {
      console.error('Gagal menghapus foto lama (exception):', err);
    }
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

    //*** Langkah 2: Verifikasi token Supabase ***
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(access_token);

    if (error || !user?.id || user.id !== user_id) {
      console.error('Invalid token or mismatch:', {
        error,
        tokenUserId: user?.id,
        requestedUserId: user_id,
      });
      throw new UnauthorizedException('Invalid token or user mismatch');
    }

    //*** Langkah 3: Ambil data admin dari tabel Admin ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select(
        `
      ID_Admin, 
      Peran, 
      ID_Stasiun
    `,
      )
      .eq('ID_Admin', user.id)
      .single();

    if (adminError) {
      console.error('Admin data fetch error:', adminError);
      throw new BadRequestException('Failed to fetch admin data');
    }

    if (!adminData) {
      throw new NotFoundException('Admin not found');
    }

    const isSuperadmin = adminData.Peran === 'Superadmin';

    // Validasi filterStasiunId untuk admin biasa
    if (!isSuperadmin && filterStasiunId) {
      throw new ForbiddenException(
        'Anda tidak boleh filter berdasarkan ID Stasiun',
      );
    }

    //*** Langkah 4: Bangun query Buku_Tamu dengan filter yang diberikan ***
    let bukuTamuQuery = supabase
      .from('Buku_Tamu')
      .select(
        `
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
  `,
      )
      .order('Waktu_Kunjungan', { ascending: false });

    //*** Langkah 5: Filter berdasarkan ID_Stasiun untuk admin biasa atau filterStasiunId untuk superadmin ***
    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak punya ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    } else if (filterStasiunId) {
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', filterStasiunId);
    }

    //*** Langkah 6: Filter berdasarkan periode atau rentang tanggal jika diberikan ***
    const now = dayjs();
    if (startDate && endDate) {
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', dayjs(startDate).startOf('day').toISOString())
        .lte('Waktu_Kunjungan', dayjs(endDate).endOf('day').toISOString());
    } else if (period === 'today') {
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', now.startOf('day').toISOString())
        .lte('Waktu_Kunjungan', now.endOf('day').toISOString());
    } else if (period === 'week') {
      const startOfWeek = now.startOf('week');
      const endOfWeek = now.endOf('week');
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', startOfWeek.toISOString())
        .lte('Waktu_Kunjungan', endOfWeek.toISOString());
    } else if (period === 'month') {
      const startOfMonth = now.startOf('month');
      const endOfMonth = now.endOf('month');
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', startOfMonth.toISOString())
        .lte('Waktu_Kunjungan', endOfMonth.toISOString());
    }

    //*** Langkah 7: Eksekusi query ***
    const { data: bukuTamuData, error: bukuTamuError } = await bukuTamuQuery;
    if (bukuTamuError) {
      console.error('Buku Tamu query error:', bukuTamuError);
      throw new BadRequestException('Failed to fetch Buku Tamu');
    }

    //*** Langkah 8: Format hasil dan kembalikan response ***
    const formattedData = bukuTamuData.map((item) => ({
      ID_Buku_Tamu: item.ID_Buku_Tamu,
      ID_Stasiun: item.ID_Stasiun,
      Tujuan: item.Tujuan,
      Waktu_Kunjungan: dayjs(item.Waktu_Kunjungan).format(
        'dddd, D MMMM YYYY, HH.mm',
      ),
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

    //*** Langkah 9: Kembalikan response ***
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
  async getBukuTamuByPeriod(
    access_token: string,
    user_id: string,
    period: 'today' | 'week' | 'month',
  ): Promise<any> {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Verifikasi token Supabase ***
    const { data: authData, error: authError } =
      await supabase.auth.getUser(access_token);

    if (authError || !authData?.user || authData.user.id !== user_id) {
      throw new UnauthorizedException(
        'Token tidak valid atau tidak cocok dengan user_id',
      );
    }

    //*** Langkah 3: Ambil data admin dari tabel Admin ***
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select('Peran, ID_Stasiun')
      .eq('ID_Admin', user_id)
      .single();

    if (adminError || !adminData) {
      throw new BadRequestException('Data admin tidak ditemukan');
    }

    const isSuperadmin = adminData.Peran === 'Superadmin';

    //*** Langkah 4: Bangun query Buku_Tamu dengan filter periode ***
    let bukuTamuQuery = supabase
      .from('Buku_Tamu')
      .select(
        `
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
    `,
      )
      .order('Waktu_Kunjungan', { ascending: false });

    //*** Langkah 5: Filter berdasarkan ID_Stasiun untuk admin biasa ***
    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak memiliki ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    }

    //*** Langkah 6: Filter berdasarkan periode yang diberikan ***
    const now = dayjs();
    if (period === 'today') {
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', now.startOf('day').toISOString())
        .lte('Waktu_Kunjungan', now.endOf('day').toISOString());
    } else if (period === 'week') {
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', now.startOf('week').toISOString())
        .lte('Waktu_Kunjungan', now.endOf('week').toISOString());
    } else if (period === 'month') {
      bukuTamuQuery = bukuTamuQuery
        .gte('Waktu_Kunjungan', now.startOf('month').toISOString())
        .lte('Waktu_Kunjungan', now.endOf('month').toISOString());
    } else {
      throw new BadRequestException('Periode filter tidak valid');
    }

    //*** Langkah 7: Eksekusi query ***
    const { data, error } = await bukuTamuQuery;

    if (error) {
      throw new BadRequestException(
        `Gagal mengambil data Buku Tamu: ${error.message}`,
      );
    }

    //*** Langkah 8: Format hasil dan kembalikan response ***
    const formattedData =
      data?.map((item) => ({
        ...item,
        Waktu_Kunjungan: dayjs(item.Waktu_Kunjungan).format(
          'dddd, D MMMM YYYY, HH.mm',
        ),
      })) || [];

    //*** Langkah 9: Kembalikan response ***
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

  //*** Fungsi untuk mendapatkan semua data admin dengan fitur search dan filter (hanya untuk Superadmin) ***
  async getAllAdmins(
    access_token: string,
    user_id: string,
    search?: string,
    filterPeran?: string,
    filterStasiunId?: string,
  ) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Verifikasi token Supabase ***
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(access_token);

    if (authError || !user?.id || user.id !== user_id) {
      throw new UnauthorizedException('Token tidak valid atau tidak sesuai');
    }

    //*** Langkah 3: Ambil data admin saat ini dari tabel Admin ***
    const { data: currentAdmin, error: currentAdminError } = await supabase
      .from('Admin')
      .select('Peran, ID_Stasiun')
      .eq('ID_Admin', user_id)
      .single();

    if (currentAdminError || !currentAdmin) {
      throw new BadRequestException('Data admin tidak ditemukan');
    }

    //*** Langkah 4: Verifikasi peran Superadmin ***
    if (currentAdmin.Peran !== 'Superadmin') {
      throw new UnauthorizedException(
        'Hanya Superadmin yang bisa mengakses data semua admin',
      );
    }

    //*** Langkah 5: Bangun query untuk mengambil data admin dengan fitur search dan filter ***
    let query = supabase.from('Admin').select(
      `
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
    `,
    );

    //*** Langkah 6: Filter pencarian (nama depan, nama belakang, email, nama stasiun), peran admin, dan ID_Stasiun ***
    if (search) {
      query = query.or(
        `Nama_Depan_Admin.ilike.%${search}%,Nama_Belakang_Admin.ilike.%${search}%,Email_Admin.ilike.%${search}%,Stasiun.Nama_Stasiun.ilike.%${search}%`,
      );
    }

    if (filterPeran) {
      query = query.eq('Peran', filterPeran);
    }

    if (filterStasiunId) {
      query = query.eq('ID_Stasiun', filterStasiunId);
    }

    //*** Langkah 7: Eksekusi query ***
    const { data, error } = await query;

    if (error) {
      throw new BadRequestException('Gagal mengambil data admin');
    }

    //*** Langkah 8: Kembalikan response ***
    return {
      message: 'Data admin berhasil diambil',
      count: data?.length || 0,
      data,
    };
  }

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

  //*** Fungsi untuk mengupdate admin (hanya untuk Superadmin) ***
  async updateAdmin(
    id_admin: string,
    dto: UpdateProfileAdminDto,
    access_token: string,
    user_id: string,
  ) {
    //*** Langkah 1: Dapatkan client Supabase dan Supabase Admin ***
    const supabase = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdminClient();

    //*** Langkah 2: Verifikasi token Supabase ***
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(access_token);

    if (authError || !user?.id || user.id !== user_id) {
      throw new UnauthorizedException('Token tidak valid atau tidak sesuai');
    }

    //*** Langkah 3: Cek role yang login dan validasi hak akses ***
    const { data: currentAdmin } = await supabase
      .from('Admin')
      .select('Peran')
      .eq('ID_Admin', user_id)
      .single();

    if (!currentAdmin) {
      throw new UnauthorizedException('Data admin tidak ditemukan');
    }

    // Hanya Superadmin yang boleh update admin lain
    if (currentAdmin.Peran !== 'Superadmin' && user_id !== id_admin) {
      throw new UnauthorizedException('Tidak diizinkan update admin lain');
    }

    //*** Langkah 4: Update password jika ada perubahan ***
    if (dto.password) {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Konfirmasi password tidak cocok');
      }

      const { error: updatePassError } =
        await supabaseAdmin.auth.admin.updateUserById(id_admin, {
          password: dto.password,
        });

      if (updatePassError) {
        throw new BadRequestException(
          'Gagal update password: ' + updatePassError.message,
        );
      }
    }

    //*** Langkah 5: Ambil data admin saat ini dari tabel Admin (untuk cek foto lama) ***
    const { data: existingAdmin } = await supabase
      .from('Admin')
      .select('Foto_Admin')
      .eq('ID_Admin', id_admin)
      .single();

    //*** Langkah 6: Handle foto upload jika ada ***
    let fotoUrl: string | null = null;
    if (dto.foto) {
      if (!['image/jpeg', 'image/png'].includes(dto.foto.mimetype)) {
        throw new BadRequestException('Format file harus JPG atau PNG');
      }
      if (dto.foto.size > 10 * 1024 * 1024) {
        throw new BadRequestException('Ukuran file maksimal 10MB');
      }

      // Hapus foto lama kalau ada
      if (existingAdmin?.Foto_Admin) {
        await this.deleteOldPhoto(existingAdmin.Foto_Admin);
      }

      const fileExt = dto.foto.originalname.split('.').pop();
      const uniqueId = randomUUID();
      const filePath = `${id_admin}_${uniqueId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('foto-admin')
        .upload(filePath, dto.foto.buffer, {
          contentType: dto.foto.mimetype,
          upsert: true,
        });

      if (uploadError) {
        throw new BadRequestException(
          'Gagal upload foto: ' + uploadError.message,
        );
      }

      fotoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/foto-admin/${filePath}`;
    }

    //*** Langkah 7: Update data admin di tabel Admin ***
    const { error: updateError } = await supabase
      .from('Admin')
      .update({
        Nama_Depan_Admin: dto.nama_depan || undefined,
        Nama_Belakang_Admin: dto.nama_belakang || undefined,
        Foto_Admin: fotoUrl || undefined,
      })
      .eq('ID_Admin', id_admin);

    if (updateError) {
      throw new BadRequestException(
        'Gagal update data admin: ' + updateError.message,
      );
    }

    //*** Langkah 8: Kembalikan response ***
    return { message: 'Admin berhasil diupdate' };
  }

  //*** Fungsi untuk menghapus admin (hanya untuk Superadmin) ***
  async deleteAdmin(access_token: string, user_id: string, id_admin: string) {
    //*** Langkah 1: Dapatkan client Supabase dan Supabase Admin ***
    const supabase = this.supabaseService.getClient();
    const supabaseAdmin = this.supabaseService.getAdminClient();

    //*** Langkah 2: Verifikasi token Supabase ***
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(access_token);
    if (authError || !user?.id || user.id !== user_id) {
      throw new UnauthorizedException('Token tidak valid atau tidak sesuai');
    }

    //*** Langkah 3: Cek role yang login (harus Superadmin) dan validasi tidak menghapus diri sendiri ***
    const { data: currentAdmin } = await supabase
      .from('Admin')
      .select('Peran')
      .eq('ID_Admin', user_id)
      .single();
    if (!currentAdmin || currentAdmin.Peran !== 'Superadmin') {
      throw new UnauthorizedException(
        'Hanya Superadmin yang bisa menghapus admin',
      );
    }
    if (user_id === id_admin) {
      throw new BadRequestException('Tidak bisa menghapus diri sendiri');
    }
    //*** Langkah 4: Ambil data admin yang akan dihapus (untuk cek foto) ***
    const { data: adminToDelete } = await supabase
      .from('Admin')
      .select('Foto_Admin')
      .eq('ID_Admin', id_admin)
      .single();
    if (!adminToDelete) {
      throw new NotFoundException('Admin yang akan dihapus tidak ditemukan');
    }
    //*** Langkah 5: Hapus foto lama jika ada ***
    if (adminToDelete.Foto_Admin) {
      await this.deleteOldPhoto(adminToDelete.Foto_Admin);
    }
    //*** Langkah 6: Hapus user dari Supabase Auth melalui Supabase Admin ***
    const { error: deleteUserError } =
      await supabaseAdmin.auth.admin.deleteUser(id_admin);
    if (deleteUserError) {
      throw new BadRequestException(
        'Gagal menghapus user: ' + deleteUserError.message,
      );
    }
    //*** Langkah 7: Hapus data admin dari tabel Admin ***
    const { error: deleteAdminError } = await supabase
      .from('Admin')
      .delete()
      .eq('ID_Admin', id_admin);
    if (deleteAdminError) {
      throw new BadRequestException(
        'Gagal menghapus data admin: ' + deleteAdminError.message,
      );
    }
    //*** Langkah 8: Kembalikan response ***
    return { message: 'Admin berhasil dihapus' };
  }
}
