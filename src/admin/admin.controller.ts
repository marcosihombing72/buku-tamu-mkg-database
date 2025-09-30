import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';

import { AdminService } from '@/admin/admin.service';
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
  async getBukuTamuController(
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
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
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
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
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
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.getBukuTamuBulanIni(access_token, user_id);
  }
}
