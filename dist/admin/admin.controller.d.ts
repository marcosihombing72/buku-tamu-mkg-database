import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { UpdateProfileAdminDto } from './dto/update-profile-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getProfile(access_token: string, user_id: string): Promise<{
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
    updateProfile(dto: UpdateProfileAdminDto, foto: Express.Multer.File, access_token: string, user_id: string): Promise<any>;
    getDashboard(access_token: string, user_id: string): Promise<{
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
    getBukuTamuHariIni(authorization: string, user_id: string): Promise<any>;
    getBukuTamuMingguIni(authorization: string, user_id: string): Promise<any>;
    getBukuTamuBulanIni(authorization: string, user_id: string): Promise<any>;
    getAllAdmins(access_token: string, user_id: string, search?: string, filterPeran?: string, filterStasiunId?: string): Promise<{
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
    createAdmin(dto: CreateAdminDto, foto: Express.Multer.File, access_token: string, user_id: string): Promise<{
        message: string;
        id: string;
        email: string;
        peran: import("./dto/create-admin.dto").PeranAdminEnum;
    }>;
    updateAdmin(dto: UpdateProfileAdminDto, foto: Express.Multer.File, access_token: string, user_id: string, id_admin: string): Promise<{
        message: string;
    }>;
    deleteAdmin(access_token: string, user_id: string, id_admin: string): Promise<{
        message: string;
    }>;
}
