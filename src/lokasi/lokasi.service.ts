import { SupabaseService } from '@/supabase/supabase.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateLokasiDto } from '@/lokasi/dto/create-lokasi.dto';
import { UpdateLokasiDto } from '@/lokasi/dto/update-lokasi.dto';

@Injectable()
export class LokasiService {
  constructor(private readonly supabaseService: SupabaseService) {}

  //*** Fungsi untuk memanggil semua data dari table Lokasi ***
  async getAllLokasi() {
    //** Langkah 1: Dapatkan client Supabase***
    const supabase = this.supabaseService.getClient();
    //*** Langkah 2: Query semua data dari tabel 'Lokasi' ***
    const { data, error } = await supabase.from('Lokasi').select('*');
    if (error) {
      throw new BadRequestException(
        `Gagal ambil data lokasi: ${error.message}`,
      );
    }
    //*** Langkah 3: Kembalikan data lokasi ***
    return { message: 'Lokasi data retrieved successfully', data };
  }

  //*** Fungsi untuk menambahkan lokasi ***
  async createLokasi(dto: CreateLokasiDto) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Masukkan data lokasi ke tabel 'Lokasi' ***
    const { data, error } = await supabase.from('Lokasi').insert({
      nama: dto.nama,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    if (error) {
      throw new BadRequestException(
        `Gagal tambah data lokasi: ${error.message}`,
      );
    }
    //*** Langkah 3: Kembalikan data lokasi yang baru ditambahkan ***
    return { message: 'Lokasi added successfully', data };
  }

  //*** Fungsi untuk memperbarui data lokasi berdasarkan ID Lokasi ***
  async updateLokasi(id: string, dto: UpdateLokasiDto) {
    //*** Langkah 1: Dapatkan client Supabase ***
    const supabase = this.supabaseService.getClient();

    //*** Langkah 2: Perbarui data lokasi di tabel 'Lokasi' berdasarkan ID Lokasi ***
    const { data, error } = await supabase
      .from('Lokasi')
      .update({
        nama: dto.nama,
        latitude: dto.latitude,
        longitude: dto.longitude,
      })
      .eq('id', id);
    if (error) {
      throw new BadRequestException(
        `Gagal perbarui data lokasi: ${error.message}`,
      );
    }
    //*** Langkah 3: Kembalikan data lokasi yang telah diperbarui ***
    return { message: 'Lokasi updated successfully', data };
  }
}
