import { SupabaseService } from '@/supabase/supabase.service';
import 'dayjs/locale/id';
import { CreateAdminDto } from '@/admin/dto/create-admin.dto';
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
            ID_Buku_Tamu: string;
            ID_Stasiun: string;
            Tujuan: string;
            Waktu_Kunjungan: string;
            Tanda_Tangan: string;
            Nama_Depan_Pengunjung: string | null;
            Nama_Belakang_Pengunjung: string | null;
            Email_Pengunjung: string | null;
            No_Telepon_Pengunjung: string | null;
            Asal_Pengunjung: string | null;
            Asal_Instansi: string | null;
            Alamat_Lengkap: string | null;
            Nama_Stasiun: string | null;
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
    createAdmin(dto: CreateAdminDto, foto: Express.Multer.File, user: SupabaseUser, user_id: string): Promise<{
        message: string;
        id: string;
        email: string;
        peran: import("@/admin/dto/create-admin.dto").PeranAdminEnum;
    }>;
    updateAdmin(user: SupabaseUser, id_admin: string, dto: UpdateProfileAdminDto, user_id: string): Promise<{
        message: string;
        updated_fields: Record<string, any>;
    }>;
    deleteAdmin(user: SupabaseUser, user_id: string, id_admin: string): Promise<{
        message: string;
    }>;
}
