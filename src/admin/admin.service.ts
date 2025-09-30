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
    const supabase = this.supabaseService.getClient();

    // 1. Login ke Supabase Auth
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

    // 2. Pastikan session tersimpan agar bisa refresh otomatis
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // 3. Ambil data admin
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

    // 4. Return response
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
    // 1. Ambil client Supabase
    const supabase = this.supabaseService.getClient();

    // 2. Verifikasi access_token
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

    // 3. Ambil data admin dari tabel Admin
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

    // 4. Transformasi data response
    const transformedData = {
      user_id: adminData.ID_Admin,
      email: adminData.Email_Admin,
      nama_depan: adminData.Nama_Depan_Admin,
      nama_belakang: adminData.Nama_Belakang_Admin,
      peran: adminData.Peran,
      foto: adminData.Foto_Admin,
      stasiun_id: adminData.ID_Stasiun,
    };

    return {
      message: 'Admin profile retrieved successfully',
      data: transformedData,
    };
  }

  async updateProfile(
    dto: UpdateProfileAdminDto & {
      access_token: string;
      user_id: string;
    },
    foto?: Express.Multer.File,
  ): Promise<any> {
    const supabase = this.supabaseService.getClient();

    const { user_id, access_token, nama_depan, nama_belakang, password } = dto;

    // 1. Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(access_token);

    if (authError || !user?.id || user.id !== user_id) {
      throw new UnauthorizedException('Token tidak valid atau tidak sesuai');
    }

    // 2. Get existing admin data
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
      // 3. Handle photo upload if exists
      if (foto) {
        // Validate file
        if (!['image/jpeg', 'image/png'].includes(foto.mimetype)) {
          throw new BadRequestException('Format file harus JPG atau PNG');
        }
        if (foto.size > 2 * 1024 * 1024) {
          throw new BadRequestException('Ukuran file maksimal 2MB');
        }

        const fileExt = foto.originalname.split('.').pop();
        uploadedFileName = `${user_id}.${fileExt}`;

        // Delete old photo via helper
        if (fotoUrl) {
          await this.deleteOldPhoto(fotoUrl);
        }

        // Upload new photo
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

      // 4. Update password if provided
      if (password) {
        const { error: pwError } = await supabase.auth.admin.updateUserById(
          user_id,
          { password },
        );
        if (pwError) {
          throw new BadRequestException('Gagal memperbarui password');
        }
        updatedFields.push('password');
      }

      // 5. Prepare update payload
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

      // 6. Update admin profile if there are changes
      if (Object.keys(updatePayload).length > 0) {
        const { error: updateError } = await supabase
          .from('Admin')
          .update(updatePayload)
          .eq('ID_Admin', user_id);

        if (updateError) {
          throw new BadRequestException('Gagal memperbarui profil admin');
        }
      }

      // Get updated admin data
      const { data: updatedAdmin } = await supabase
        .from('Admin')
        .select('Nama_Depan_Admin, Nama_Belakang_Admin, Foto_Admin')
        .eq('ID_Admin', user_id)
        .single();

      const transformedData = {
        nama_depan:
          updatedAdmin?.Nama_Depan_Admin || existingAdmin.Nama_Depan_Admin,
        nama_belakang:
          updatedAdmin?.Nama_Belakang_Admin ||
          existingAdmin.Nama_Belakang_Admin,
        foto: updatedAdmin?.Foto_Admin || existingAdmin.Foto_Admin,
      };

      return {
        message:
          updatedFields.length > 0
            ? 'Profil admin berhasil diperbarui'
            : 'Tidak ada perubahan yang dilakukan',
        data: transformedData,
        updated_fields: updatedFields,
      };
    } catch (error) {
      // Cleanup if error occurs after photo upload
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

  private async deleteOldPhoto(fotoUrl: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    try {
      const oldFileName = fotoUrl.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('foto-admin').remove([oldFileName]);
      }
    } catch (err) {
      console.error('Gagal menghapus foto lama:', err);
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
    const supabase = this.supabaseService.getClient();

    // 1. Verify access_token
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

    // 2. Get admin data
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

    // 3. Validate filter
    if (!isSuperadmin && filterStasiunId) {
      throw new ForbiddenException(
        'Anda tidak boleh filter berdasarkan ID Stasiun',
      );
    }

    // 4. Base query Buku_Tamu
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

    // 5. Apply stasiun filter
    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak punya ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    } else if (filterStasiunId) {
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', filterStasiunId);
    }

    // 6. Date filter
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

    // 7. Execute query
    const { data: bukuTamuData, error: bukuTamuError } = await bukuTamuQuery;
    if (bukuTamuError) {
      console.error('Buku Tamu query error:', bukuTamuError);
      throw new BadRequestException('Failed to fetch Buku Tamu');
    }

    // 8. Format hasil
    const formattedData = bukuTamuData.map((item) => ({
      id: item.ID_Buku_Tamu,
      stasiun_id: item.ID_Stasiun,
      tujuan: item.Tujuan,
      waktu: dayjs(item.Waktu_Kunjungan).format('dddd, D MMMM YYYY, HH.mm'),
      tanda_tangan: item.Tanda_Tangan,
      nama_depan: item.Nama_Depan_Pengunjung,
      nama_belakang: item.Nama_Belakang_Pengunjung,
      email: item.Email_Pengunjung,
      telepon: item.No_Telepon_Pengunjung,
      asal: item.Asal_Pengunjung,
      instansi: item.Asal_Instansi,
      alamat: item.Alamat_Lengkap,
      stasiun: item.Stasiun?.[0]?.Nama_Stasiun,
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

  //*** Fungsi helper untuk mendapatkan data Buku Tamu berdasarkan periode tertentu (hari ini, minggu ini, bulan ini) ***
  async getBukuTamuByPeriod(
    access_token: string,
    user_id: string,
    period: 'today' | 'week' | 'month',
  ): Promise<any> {
    const supabase = this.supabaseService.getClient();

    // 1. Verifikasi token
    const { data: authData, error: authError } =
      await supabase.auth.getUser(access_token);

    if (authError || !authData?.user || authData.user.id !== user_id) {
      throw new UnauthorizedException(
        'Token tidak valid atau tidak cocok dengan user_id',
      );
    }

    // 2. Ambil data admin
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select('Peran, ID_Stasiun')
      .eq('ID_Admin', user_id)
      .single();

    if (adminError || !adminData) {
      throw new BadRequestException('Data admin tidak ditemukan');
    }

    const isSuperadmin = adminData.Peran === 'Superadmin';

    // 3. Base query Buku_Tamu (pakai struktur terbaru)
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

    // 4. Filter admin biasa (stasiun)
    if (!isSuperadmin) {
      if (!adminData.ID_Stasiun) {
        throw new BadRequestException('Admin tidak memiliki ID_Stasiun');
      }
      bukuTamuQuery = bukuTamuQuery.eq('ID_Stasiun', adminData.ID_Stasiun);
    }

    // 5. Filter periode
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

    // 6. Eksekusi query
    const { data, error } = await bukuTamuQuery;

    if (error) {
      throw new BadRequestException(
        `Gagal mengambil data Buku Tamu: ${error.message}`,
      );
    }

    // 7. Format hasil
    const formattedData =
      data?.map((item) => ({
        ...item,
        Waktu_Kunjungan: dayjs(item.Waktu_Kunjungan).format(
          'dddd, D MMMM YYYY, HH.mm',
        ),
      })) || [];

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
