import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }

    request.user = data.user;
    return true;
  }
}
