import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from '@/admin/admin.service';
import { CreateAdminDto } from '@/admin/dto/create-admin.dto';
import { LoginAdminDto } from '@/admin/dto/login-admin.dto';
import { ResetPasswordAdminDto } from '@/admin/dto/reset-password-admin.dto';
import { UpdateProfileAdminDto } from '@/admin/dto/update-profile-admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async loginAdmin(@Body() dto: LoginAdminDto) {
    return this.adminService.loginAdmin(dto);
  }

  @Post('reset-password')
  async resetPasswordAdmin(@Body() dto: ResetPasswordAdminDto) {
    return this.adminService.resetPasswordAdmin(dto);
  }

  @Get('profile')
  async getProfile(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.getProfile(user_id, access_token);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileAdminDto })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_depan: { type: 'string' },
        nama_belakang: { type: 'string' },
        password: { type: 'string' },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('update-profile')
  @UseInterceptors(FileInterceptor('foto'))
  async updateProfile(
    @Body() dto: UpdateProfileAdminDto,
    @UploadedFile() foto: Express.Multer.File,
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.updateProfile(
      {
        ...dto,
        access_token,
        user_id,
      },
      foto,
    );
  }

  @Get('dashboard')
  async getDashboard(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.getDashboard(access_token, user_id);
  }

  @Get('buku-tamu')
  @ApiHeader({ name: 'access_token', required: true })
  @ApiHeader({ name: 'user_id', required: true })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['today', 'week', 'month'],
  })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'filterStasiunId', required: false })
  async getBukuTamu(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
    @Query('period') period?: 'today' | 'week' | 'month',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filterStasiunId') filterStasiunId?: string,
  ) {
    return this.adminService.getBukuTamu(
      access_token,
      user_id,
      period,
      startDate,
      endDate,
      filterStasiunId,
    );
  }

  @Get('buku-tamu/hari-ini')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  async getBukuTamuHariIni(
    @Headers('access_token') authorization: string,
    @Headers('user_id') user_id: string,
  ) {
    const access_token = authorization?.replace('Bearer ', '');
    return this.adminService.getBukuTamuHariIni(access_token, user_id);
  }

  @Get('buku-tamu/minggu-ini')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  async getBukuTamuMingguIni(
    @Headers('access_token') authorization: string,
    @Headers('user_id') user_id: string,
  ) {
    const access_token = authorization?.replace('Bearer ', '');
    return this.adminService.getBukuTamuMingguIni(access_token, user_id);
  }

  @Get('buku-tamu/bulan-ini')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  async getBukuTamuBulanIni(
    @Headers('access_token') authorization: string,
    @Headers('user_id') user_id: string,
  ) {
    const access_token = authorization?.replace('Bearer ', '');
    return this.adminService.getBukuTamuBulanIni(access_token, user_id);
  }

  @Get('all-admins')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'filterPeran', required: false })
  @ApiQuery({ name: 'filterStasiunId', required: false })
  async getAllAdmins(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
    @Query('search') search?: string,
    @Query('filterPeran') filterPeran?: string,
    @Query('filterStasiunId') filterStasiunId?: string,
  ) {
    return this.adminService.getAllAdmins(
      access_token,
      user_id,
      search,
      filterPeran,
      filterStasiunId,
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_depan: { type: 'string' },
        nama_belakang: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        confirmPassword: { type: 'string' },
        peran: { type: 'string' },
        id_stasiun: { type: 'string' },
        foto: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('create-admin')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  @UseInterceptors(FileInterceptor('foto'))
  async createAdmin(
    @Body() dto: CreateAdminDto,
    @UploadedFile() foto: Express.Multer.File,
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.createAdmin(dto, foto, access_token, user_id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileAdminDto })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_depan: { type: 'string' },
        nama_belakang: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        confirmPassword: { type: 'string' },
        foto: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('update-admin')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  async updateAdmin(
    @Body() dto: UpdateProfileAdminDto,
    @UploadedFile() foto: Express.Multer.File,
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
    @Param('id_admin') id_admin: string,
  ) {
    return this.adminService.updateAdmin(
      user_id,
      {
        ...dto,
        foto,
      },
      access_token,
      user_id,
    );
  }

  @Delete('delete-admin/:id_admin')
  @ApiHeader({
    name: 'access_token',
    description: 'your-access_token',
    required: true,
  })
  @ApiHeader({
    name: 'user_id',
    description: 'ID user',
    required: true,
  })
  async deleteAdmin(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
    @Param('id_admin') id_admin: string,
  ) {
    return this.adminService.deleteAdmin(access_token, user_id, id_admin);
  }
}
