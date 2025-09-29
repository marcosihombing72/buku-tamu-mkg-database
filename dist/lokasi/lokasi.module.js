"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokasiModule = void 0;
const lokasi_controller_1 = require("./lokasi.controller");
const lokasi_service_1 = require("./lokasi.service");
const supabase_module_1 = require("../supabase/supabase.module");
const common_1 = require("@nestjs/common");
let LokasiModule = class LokasiModule {
};
exports.LokasiModule = LokasiModule;
exports.LokasiModule = LokasiModule = __decorate([
    (0, common_1.Module)({
        imports: [supabase_module_1.SupabaseModule],
        controllers: [lokasi_controller_1.LokasiController],
        providers: [lokasi_service_1.LokasiService],
    })
], LokasiModule);
//# sourceMappingURL=lokasi.module.js.map