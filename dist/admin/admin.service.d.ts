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
        admin: any;
        token: {
            access_token: string;
            refresh_token: string;
            expires_at: number | undefined;
        };
    }>;
    resetPasswordAdmin(dto: ResetPasswordAdminDto): Promise<{
        message: string;
        email: string;
    }>;
    getProfileAdmin(user_id: string, access_token: string): Promise<{
        message: string;
        data: any;
    }>;
    private deleteOldPhoto;
    updateProfileAdmin(dto: UpdateProfileAdminDto, foto?: Express.Multer.File): Promise<{
        message: string;
        updatedFields: string[];
    }>;
    getDashboard(user_id: string, access_token: string): Promise<{
        peran: any;
        id_stasiun: any;
        jumlah_tamu: number;
    }>;
    getBukuTamu(access_token: string, user_id: string, period?: 'today' | 'week' | 'month', startDate?: string, endDate?: string, filterStasiunId?: string): Promise<{
        message: string;
        data: any[];
    }>;
    private getBukuTamuByPeriod;
    getBukuTamuHariIni(access_token: string, user_id: string): Promise<{
        period: "today" | "week" | "month";
        isSuperadmin: boolean;
        stationFilter: any;
        count: number;
        data: any[];
    }>;
    getBukuTamuMingguIni(access_token: string, user_id: string): Promise<{
        period: "today" | "week" | "month";
        isSuperadmin: boolean;
        stationFilter: any;
        count: number;
        data: any[];
    }>;
    getBukuTamuBulanIni(access_token: string, user_id: string): Promise<{
        period: "today" | "week" | "month";
        isSuperadmin: boolean;
        stationFilter: any;
        count: number;
        data: any[];
    }>;
}
