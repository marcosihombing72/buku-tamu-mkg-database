import { SupabaseService } from '@/supabase/supabase.service';
import 'dayjs/locale/id';
import { LoginAdminDto } from '@/admin/dto/login-admin.dto';
import { ResetPasswordAdminDto } from '@/admin/dto/reset-password-admin.dto';
import { UpdateProfileAdminDto } from '@/admin/dto/update-profile-admin.dto';
import { SupabaseUser } from '@/interfaces/supabase-user.interface';
export declare class AdminService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    loginAdmin(dto: LoginAdminDto): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        user_id: string;
        peran: any;
        nama_depan: any;
        nama_belakang: any;
        id_stasiun: any;
        expires_at: number | undefined;
    }>;
    resetPasswordAdmin(dto: ResetPasswordAdminDto): Promise<{
        message: string;
        email: string;
    }>;
    getProfile(user_id: string): Promise<{
        message: string;
        data: {
            user_id: any;
            email: any;
            nama_depan: any;
            nama_belakang: any;
            peran: any;
            foto: any;
            stasiun_id: any;
            stasiun_nama: any;
        };
    }>;
    updateProfile(user: SupabaseUser, user_id: string, dto: UpdateProfileAdminDto, foto?: Express.Multer.File): Promise<any>;
    private deleteOldPhoto;
    getBukuTamu(user: SupabaseUser, user_id: string, period?: 'today' | 'week' | 'month', startDate?: string, endDate?: string, filterStasiunId?: string): Promise<{
        filter: {
            period: "today" | "week" | "month" | null;
            startDate: string | null;
            endDate: string | null;
            filterStasiunId: any;
        };
        isSuperadmin: boolean;
        count: number;
        data: {
            ID_Buku_Tamu: any;
            ID_Stasiun: any;
            Tujuan: any;
            Waktu_Kunjungan: string;
            Tanda_Tangan: any;
            Nama_Depan_Pengunjung: any;
            Nama_Belakang_Pengunjung: any;
            Email_Pengunjung: any;
            No_Telepon_Pengunjung: any;
            Asal_Pengunjung: any;
            Asal_Instansi: any;
            Alamat_Lengkap: any;
            Nama_Stasiun: any;
        }[];
    }>;
    getBukuTamuByPeriod(user: SupabaseUser, user_id: string, period: 'today' | 'week' | 'month'): Promise<any>;
    getBukuTamuHariIni(user: SupabaseUser, user_id: string): Promise<any>;
    getBukuTamuMingguIni(user: SupabaseUser, user_id: string): Promise<any>;
    getBukuTamuBulanIni(user: SupabaseUser, user_id: string): Promise<any>;
    getAllAdmins(user: SupabaseUser, user_id: string, search?: string, filterPeran?: string, filterStasiunId?: string): Promise<{
        message: string;
        count: number;
        data: {
            ID_Admin: any;
            Nama_Depan_Admin: any;
            Nama_Belakang_Admin: any;
            Email_Admin: any;
            Peran: any;
            Foto_Admin: any;
            Created_At: any;
            Stasiun: {
                ID_Stasiun: any;
                Nama_Stasiun: any;
            }[];
        }[];
    }>;
    updateAdmin(user: SupabaseUser, id_admin: string, dto: UpdateProfileAdminDto, user_id: string): Promise<{
        message: string;
        updated_fields: Record<string, any>;
    }>;
    deleteAdmin(user: SupabaseUser, user_id: string, id_admin: string): Promise<{
        message: string;
    }>;
}
