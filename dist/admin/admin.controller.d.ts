import { AdminService } from '@/admin/admin.service';
import { LoginAdminDto } from '@/admin/dto/login-admin.dto';
import { ResetPasswordAdminDto } from '@/admin/dto/reset-password-admin.dto';
import { UpdateProfileAdminDto } from '@/admin/dto/update-profile-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    loginAdmin(dto: LoginAdminDto): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        user_id: string;
        role: any;
        expires_at: number | undefined;
    }>;
    resetPasswordAdmin(dto: ResetPasswordAdminDto): Promise<{
        message: string;
        email: string;
    }>;
    getProfileAdmin(user_id: string, access_token: string): Promise<{
        message: string;
        data: any;
    }>;
    updateProfileAdmin(dto: UpdateProfileAdminDto, foto?: Express.Multer.File): Promise<{
        message: string;
        updatedFields: string[];
    }>;
    getDashboard(access_token: string, user_id: string): Promise<{
        peran: any;
        id_stasiun: any;
        jumlah_tamu: number;
    }>;
    getBukuTamu(access_token: string, user_id: string, period?: 'today' | 'week' | 'month', startDate?: string, endDate?: string, filterStasiunId?: string): Promise<{
        message: string;
        data: any[];
    }>;
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
