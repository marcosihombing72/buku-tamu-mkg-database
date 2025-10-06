import { SupabaseService } from '@/supabase/supabase.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateLokasiDto } from '@/lokasi/dto/create-lokasi.dto';
import { UpdateLokasiDto } from '@/lokasi/dto/update-lokasi.dto';

@Injectable()
export class LokasiService {
  constructor(private readonly supabaseService: SupabaseService) {}

  //*** Fungsi untuk memanggil semua data dari table Lokasi ***
async getAllLokasi(filters?: {
  latitude?: number;
  longitude?: number;
  nama?: string;
}) {
  //*** Langkah 1: Dapatkan client Supabase ***
  const supabase = this.supabaseService.getClient();

  //*** Langkah 2: Mulai query dasar ***
  let query = supabase.from('Lokasi').select('*');

  //*** Langkah 3: Tambahkan filter optional ***
  if (filters) {
    const { latitude, longitude, nama } = filters;

    if (latitude !== undefined) {
      query = query.eq('latitude', latitude);
    }

    if (longitude !== undefined) {
      query = query.eq('longitude', longitude);
    }

    if (nama) {
      // gunakan case-insensitive match (ilike di Supabase/Postgres)
      query = query.ilike('nama', `%${nama}%`);
    }
  }

  //*** Langkah 4: Eksekusi query ***
  const { data, error } = await query;

  if (error) {
    throw new BadRequestException(
      `Gagal ambil data lokasi: ${error.message}`,
    );
  }

  //*** Langkah 5: Kembalikan data lokasi ***
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
