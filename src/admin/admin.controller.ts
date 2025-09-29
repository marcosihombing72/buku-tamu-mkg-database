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
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

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
  @ApiQuery({
    name: 'user_id',
    required: true,
    example: '69fe727f-17e3-4065-a16e-23efb26382cf',
  })
  @ApiQuery({
    name: 'access_token',
    required: true,
    example: 'your_access_token_here',
  })
  async getProfile(
    @Query('user_id') user_id: string,
    @Query('access_token') access_token: string,
  ) {
    return this.adminService.getProfile(user_id, access_token);
  }

  @Put('update-profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('foto'))
  async updateProfile(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
    @Body() dto: UpdateProfileAdminDto,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    return this.adminService.updateProfile(
      { ...dto, access_token, user_id },
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
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['today', 'week', 'month'],
    example: 'today',
  })
  @ApiQuery({ name: 'startDate', required: false, example: '2023-10-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2023-10-31' })
  @ApiQuery({
    name: 'filterStasiunId',
    required: false,
    example: '5b2df30a-4204-470a-bfff-da645ed475d4',
  })
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
  async getBukuTamuHariIni(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.getBukuTamuHariIni(access_token, user_id);
  }

  @Get('buku-tamu/minggu-ini')
  async getBukuTamuMingguIni(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.getBukuTamuMingguIni(access_token, user_id);
  }

  @Get('buku-tamu/bulan-ini')
  async getBukuTamuBulanIni(
    @Headers('access_token') access_token: string,
    @Headers('user_id') user_id: string,
  ) {
    return this.adminService.getBukuTamuBulanIni(access_token, user_id);
  }
}
