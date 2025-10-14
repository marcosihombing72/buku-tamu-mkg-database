"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsiBukuTamuDto = exports.AsalPengunjung = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var AsalPengunjung;
(function (AsalPengunjung) {
    AsalPengunjung["BMKG"] = "BMKG";
    AsalPengunjung["Pemerintah_Pusat_atau_Pemerintah_Daerah"] = "Pemerintah Pusat/Pemerintah Daerah";
    AsalPengunjung["Umum"] = "Umum";
    AsalPengunjung["Universitas"] = "Universitas";
})(AsalPengunjung || (exports.AsalPengunjung = AsalPengunjung = {}));
var IsiBukuTamuDto = function () {
    var _a;
    var _tujuan_decorators;
    var _tujuan_initializers = [];
    var _tujuan_extraInitializers = [];
    var _id_stasiun_decorators;
    var _id_stasiun_initializers = [];
    var _id_stasiun_extraInitializers = [];
    var _Nama_Depan_Pengunjung_decorators;
    var _Nama_Depan_Pengunjung_initializers = [];
    var _Nama_Depan_Pengunjung_extraInitializers = [];
    var _Nama_Belakang_Pengunjung_decorators;
    var _Nama_Belakang_Pengunjung_initializers = [];
    var _Nama_Belakang_Pengunjung_extraInitializers = [];
    var _Email_Pengunjung_decorators;
    var _Email_Pengunjung_initializers = [];
    var _Email_Pengunjung_extraInitializers = [];
    var _No_Telepon_Pengunjung_decorators;
    var _No_Telepon_Pengunjung_initializers = [];
    var _No_Telepon_Pengunjung_extraInitializers = [];
    var _Asal_Pengunjung_decorators;
    var _Asal_Pengunjung_initializers = [];
    var _Asal_Pengunjung_extraInitializers = [];
    var _Asal_Instansi_decorators;
    var _Asal_Instansi_initializers = [];
    var _Asal_Instansi_extraInitializers = [];
    var _waktu_kunjungan_decorators;
    var _waktu_kunjungan_initializers = [];
    var _waktu_kunjungan_extraInitializers = [];
    var _Alamat_Lengkap_decorators;
    var _Alamat_Lengkap_initializers = [];
    var _Alamat_Lengkap_extraInitializers = [];
    var _tanda_tangan_decorators;
    var _tanda_tangan_initializers = [];
    var _tanda_tangan_extraInitializers = [];
    return _a = /** @class */ (function () {
            function IsiBukuTamuDto() {
                this.tujuan = __runInitializers(this, _tujuan_initializers, void 0);
                this.id_stasiun = (__runInitializers(this, _tujuan_extraInitializers), __runInitializers(this, _id_stasiun_initializers, void 0));
                this.Nama_Depan_Pengunjung = (__runInitializers(this, _id_stasiun_extraInitializers), __runInitializers(this, _Nama_Depan_Pengunjung_initializers, void 0));
                this.Nama_Belakang_Pengunjung = (__runInitializers(this, _Nama_Depan_Pengunjung_extraInitializers), __runInitializers(this, _Nama_Belakang_Pengunjung_initializers, void 0));
                this.Email_Pengunjung = (__runInitializers(this, _Nama_Belakang_Pengunjung_extraInitializers), __runInitializers(this, _Email_Pengunjung_initializers, void 0));
                this.No_Telepon_Pengunjung = (__runInitializers(this, _Email_Pengunjung_extraInitializers), __runInitializers(this, _No_Telepon_Pengunjung_initializers, void 0));
                this.Asal_Pengunjung = (__runInitializers(this, _No_Telepon_Pengunjung_extraInitializers), __runInitializers(this, _Asal_Pengunjung_initializers, void 0));
                this.Asal_Instansi = (__runInitializers(this, _Asal_Pengunjung_extraInitializers), __runInitializers(this, _Asal_Instansi_initializers, void 0));
                this.waktu_kunjungan = (__runInitializers(this, _Asal_Instansi_extraInitializers), __runInitializers(this, _waktu_kunjungan_initializers, void 0));
                this.Alamat_Lengkap = (__runInitializers(this, _waktu_kunjungan_extraInitializers), __runInitializers(this, _Alamat_Lengkap_initializers, void 0));
                this.tanda_tangan = (__runInitializers(this, _Alamat_Lengkap_extraInitializers), __runInitializers(this, _tanda_tangan_initializers, void 0));
                __runInitializers(this, _tanda_tangan_extraInitializers);
            }
            return IsiBukuTamuDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tujuan_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Tujuan kunjungan pengunjung',
                    example: 'Rapat koordinasi',
                }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _id_stasiun_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ID stasiun',
                    example: '5b2df30a-4204-470a-bfff-da645ed475d4',
                }), (0, class_validator_1.IsNotEmpty)()];
            _Nama_Depan_Pengunjung_decorators = [(0, swagger_1.ApiProperty)({ example: 'Ahmad' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _Nama_Belakang_Pengunjung_decorators = [(0, swagger_1.ApiProperty)({ example: 'Hidayat', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _Email_Pengunjung_decorators = [(0, swagger_1.ApiProperty)({ example: 'ahmad@example.com' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)()];
            _No_Telepon_Pengunjung_decorators = [(0, swagger_1.ApiProperty)({ example: '08123456789' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _Asal_Pengunjung_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Asal pengunjung',
                    enum: AsalPengunjung,
                    enumName: 'AsalPengunjung',
                    example: AsalPengunjung.BMKG,
                }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(AsalPengunjung)];
            _Asal_Instansi_decorators = [(0, swagger_1.ApiProperty)({ example: 'Dishub' }), (0, class_validator_1.IsString)()];
            _waktu_kunjungan_decorators = [(0, swagger_1.ApiProperty)({ example: 'Senin, 10 Juni 2024, 14.30' })];
            _Alamat_Lengkap_decorators = [(0, swagger_1.ApiProperty)({ example: 'Jl. Merdeka No. 10, Bandung' }), (0, class_validator_1.IsNotEmpty)()];
            _tanda_tangan_decorators = [(0, swagger_1.ApiProperty)({
                    type: 'string',
                    format: 'binary',
                    description: 'File tanda tangan (PNG/JPG)',
                })];
            __esDecorate(null, null, _tujuan_decorators, { kind: "field", name: "tujuan", static: false, private: false, access: { has: function (obj) { return "tujuan" in obj; }, get: function (obj) { return obj.tujuan; }, set: function (obj, value) { obj.tujuan = value; } }, metadata: _metadata }, _tujuan_initializers, _tujuan_extraInitializers);
            __esDecorate(null, null, _id_stasiun_decorators, { kind: "field", name: "id_stasiun", static: false, private: false, access: { has: function (obj) { return "id_stasiun" in obj; }, get: function (obj) { return obj.id_stasiun; }, set: function (obj, value) { obj.id_stasiun = value; } }, metadata: _metadata }, _id_stasiun_initializers, _id_stasiun_extraInitializers);
            __esDecorate(null, null, _Nama_Depan_Pengunjung_decorators, { kind: "field", name: "Nama_Depan_Pengunjung", static: false, private: false, access: { has: function (obj) { return "Nama_Depan_Pengunjung" in obj; }, get: function (obj) { return obj.Nama_Depan_Pengunjung; }, set: function (obj, value) { obj.Nama_Depan_Pengunjung = value; } }, metadata: _metadata }, _Nama_Depan_Pengunjung_initializers, _Nama_Depan_Pengunjung_extraInitializers);
            __esDecorate(null, null, _Nama_Belakang_Pengunjung_decorators, { kind: "field", name: "Nama_Belakang_Pengunjung", static: false, private: false, access: { has: function (obj) { return "Nama_Belakang_Pengunjung" in obj; }, get: function (obj) { return obj.Nama_Belakang_Pengunjung; }, set: function (obj, value) { obj.Nama_Belakang_Pengunjung = value; } }, metadata: _metadata }, _Nama_Belakang_Pengunjung_initializers, _Nama_Belakang_Pengunjung_extraInitializers);
            __esDecorate(null, null, _Email_Pengunjung_decorators, { kind: "field", name: "Email_Pengunjung", static: false, private: false, access: { has: function (obj) { return "Email_Pengunjung" in obj; }, get: function (obj) { return obj.Email_Pengunjung; }, set: function (obj, value) { obj.Email_Pengunjung = value; } }, metadata: _metadata }, _Email_Pengunjung_initializers, _Email_Pengunjung_extraInitializers);
            __esDecorate(null, null, _No_Telepon_Pengunjung_decorators, { kind: "field", name: "No_Telepon_Pengunjung", static: false, private: false, access: { has: function (obj) { return "No_Telepon_Pengunjung" in obj; }, get: function (obj) { return obj.No_Telepon_Pengunjung; }, set: function (obj, value) { obj.No_Telepon_Pengunjung = value; } }, metadata: _metadata }, _No_Telepon_Pengunjung_initializers, _No_Telepon_Pengunjung_extraInitializers);
            __esDecorate(null, null, _Asal_Pengunjung_decorators, { kind: "field", name: "Asal_Pengunjung", static: false, private: false, access: { has: function (obj) { return "Asal_Pengunjung" in obj; }, get: function (obj) { return obj.Asal_Pengunjung; }, set: function (obj, value) { obj.Asal_Pengunjung = value; } }, metadata: _metadata }, _Asal_Pengunjung_initializers, _Asal_Pengunjung_extraInitializers);
            __esDecorate(null, null, _Asal_Instansi_decorators, { kind: "field", name: "Asal_Instansi", static: false, private: false, access: { has: function (obj) { return "Asal_Instansi" in obj; }, get: function (obj) { return obj.Asal_Instansi; }, set: function (obj, value) { obj.Asal_Instansi = value; } }, metadata: _metadata }, _Asal_Instansi_initializers, _Asal_Instansi_extraInitializers);
            __esDecorate(null, null, _waktu_kunjungan_decorators, { kind: "field", name: "waktu_kunjungan", static: false, private: false, access: { has: function (obj) { return "waktu_kunjungan" in obj; }, get: function (obj) { return obj.waktu_kunjungan; }, set: function (obj, value) { obj.waktu_kunjungan = value; } }, metadata: _metadata }, _waktu_kunjungan_initializers, _waktu_kunjungan_extraInitializers);
            __esDecorate(null, null, _Alamat_Lengkap_decorators, { kind: "field", name: "Alamat_Lengkap", static: false, private: false, access: { has: function (obj) { return "Alamat_Lengkap" in obj; }, get: function (obj) { return obj.Alamat_Lengkap; }, set: function (obj, value) { obj.Alamat_Lengkap = value; } }, metadata: _metadata }, _Alamat_Lengkap_initializers, _Alamat_Lengkap_extraInitializers);
            __esDecorate(null, null, _tanda_tangan_decorators, { kind: "field", name: "tanda_tangan", static: false, private: false, access: { has: function (obj) { return "tanda_tangan" in obj; }, get: function (obj) { return obj.tanda_tangan; }, set: function (obj, value) { obj.tanda_tangan = value; } }, metadata: _metadata }, _tanda_tangan_initializers, _tanda_tangan_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.IsiBukuTamuDto = IsiBukuTamuDto;
