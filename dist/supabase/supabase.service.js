"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    configService;
    anonClient;
    adminClient;
    constructor(configService) {
        this.configService = configService;
        const url = this.configService.get('SUPABASE_URL');
        const anonKey = this.configService.get('SUPABASE_KEY');
        const serviceRoleKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!url || !anonKey || !serviceRoleKey) {
            throw new Error('SUPABASE_URL, SUPABASE_KEY, dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env');
        }
        this.anonClient = (0, supabase_js_1.createClient)(url, anonKey);
        this.adminClient = (0, supabase_js_1.createClient)(url, serviceRoleKey);
    }
    getClient() {
        return this.anonClient;
    }
    getAdminClient() {
        return this.adminClient;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map