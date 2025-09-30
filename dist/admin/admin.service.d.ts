import { SupabaseService } from '@/supabase/supabase.service';
import 'dayjs/locale/id';
import { LoginAdminDto } from '@/admin/dto/login-admin.dto';
import { ResetPasswordAdminDto } from '@/admin/dto/reset-password-admin.dto';
import { UpdateProfileAdminDto } from '@/admin/dto/update-profile-admin.dto';
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
        expires_at: number | undefined;
    }>;
    resetPasswordAdmin(dto: ResetPasswordAdminDto): Promise<{
        message: string;
        email: string;
    }>;
    getProfile(user_id: string, access_token: string): Promise<{
        message: string;
        data: {
            user_id: any;
            email: any;
            nama_depan: any;
            nama_belakang: any;
            peran: any;
            foto: any;
            stasiun_id: any;
        };
    }>;
    updateProfile(dto: UpdateProfileAdminDto & {
        access_token: string;
        user_id: string;
    }, foto?: Express.Multer.File): Promise<any>;
    private deleteOldPhoto;
    getDashboard(user_id: string, access_token: string): Promise<{
        peran: any;
        id_stasiun: any;
        jumlah_tamu: number;
    }>;
    getBukuTamu(access_token: string, user_id: string, period?: 'today' | 'week' | 'month', startDate?: string, endDate?: string, filterStasiunId?: string): Promise<{
        filter: {
            period: "today" | "week" | "month" | null;
            startDate: string | null;
            endDate: string | null;
            filterStasiunId: any;
        };
        isSuperadmin: boolean;
        count: number;
        data: {
            id: any;
            stasiun_id: any;
            tujuan: any;
            waktu: string;
            tanda_tangan: any;
            nama_depan: any;
            nama_belakang: any;
            email: any;
            telepon: any;
            asal: any;
            instansi: any;
            alamat: any;
            stasiun: any;
        }[];
    }>;
    getBukuTamuByPeriod(access_token: string, user_id: string, period: 'today' | 'week' | 'month'): Promise<any>;
    getBukuTamuHariIni(access_token: string, user_id: string): Promise<any>;
    getBukuTamuMingguIni(access_token: string, user_id: string): Promise<any>;
    getBukuTamuBulanIni(access_token: string, user_id: string): Promise<any>;
}
