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
exports.UpdateAdminDto = exports.PeranAdminEnum = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var PeranAdminEnum;
(function (PeranAdminEnum) {
    PeranAdminEnum["ADMIN"] = "Admin";
    PeranAdminEnum["SUPERADMIN"] = "Superadmin";
})(PeranAdminEnum || (exports.PeranAdminEnum = PeranAdminEnum = {}));
var UpdateAdminDto = function () {
    var _a;
    var _nama_depan_decorators;
    var _nama_depan_initializers = [];
    var _nama_depan_extraInitializers = [];
    var _nama_belakang_decorators;
    var _nama_belakang_initializers = [];
    var _nama_belakang_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _confirmPassword_decorators;
    var _confirmPassword_initializers = [];
    var _confirmPassword_extraInitializers = [];
    var _peran_decorators;
    var _peran_initializers = [];
    var _peran_extraInitializers = [];
    var _id_stasiun_decorators;
    var _id_stasiun_initializers = [];
    var _id_stasiun_extraInitializers = [];
    var _foto_decorators;
    var _foto_initializers = [];
    var _foto_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateAdminDto() {
                this.nama_depan = __runInitializers(this, _nama_depan_initializers, void 0);
                this.nama_belakang = (__runInitializers(this, _nama_depan_extraInitializers), __runInitializers(this, _nama_belakang_initializers, void 0));
                this.email = (__runInitializers(this, _nama_belakang_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.confirmPassword = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _confirmPassword_initializers, void 0));
                this.peran = (__runInitializers(this, _confirmPassword_extraInitializers), __runInitializers(this, _peran_initializers, void 0));
                this.id_stasiun = (__runInitializers(this, _peran_extraInitializers), __runInitializers(this, _id_stasiun_initializers, void 0));
                this.foto = (__runInitializers(this, _id_stasiun_extraInitializers), __runInitializers(this, _foto_initializers, void 0));
                __runInitializers(this, _foto_extraInitializers);
            }
            return UpdateAdminDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nama_depan_decorators = [(0, swagger_1.ApiProperty)({ example: 'Budi', description: 'Nama depan admin' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _nama_belakang_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Santoso',
                    description: 'Nama belakang admin',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'admin@example.com',
                    description: 'Email admin',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _password_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'password123',
                    description: 'Password baru admin minimal 6 karakter',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6)];
            _confirmPassword_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'password123',
                    description: 'Konfirmasi password admin',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _peran_decorators = [(0, swagger_1.ApiProperty)({
                    enum: PeranAdminEnum,
                    example: PeranAdminEnum.ADMIN,
                    description: 'Peran admin',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PeranAdminEnum)];
            _id_stasiun_decorators = [(0, swagger_1.ApiProperty)({
                    example: '123',
                    description: 'ID stasiun (hanya untuk Admin, bukan Superadmin)',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _foto_decorators = [(0, swagger_1.ApiProperty)({
                    type: 'string',
                    format: 'binary',
                    description: 'Foto admin baru (opsional)',
                }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _nama_depan_decorators, { kind: "field", name: "nama_depan", static: false, private: false, access: { has: function (obj) { return "nama_depan" in obj; }, get: function (obj) { return obj.nama_depan; }, set: function (obj, value) { obj.nama_depan = value; } }, metadata: _metadata }, _nama_depan_initializers, _nama_depan_extraInitializers);
            __esDecorate(null, null, _nama_belakang_decorators, { kind: "field", name: "nama_belakang", static: false, private: false, access: { has: function (obj) { return "nama_belakang" in obj; }, get: function (obj) { return obj.nama_belakang; }, set: function (obj, value) { obj.nama_belakang = value; } }, metadata: _metadata }, _nama_belakang_initializers, _nama_belakang_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _confirmPassword_decorators, { kind: "field", name: "confirmPassword", static: false, private: false, access: { has: function (obj) { return "confirmPassword" in obj; }, get: function (obj) { return obj.confirmPassword; }, set: function (obj, value) { obj.confirmPassword = value; } }, metadata: _metadata }, _confirmPassword_initializers, _confirmPassword_extraInitializers);
            __esDecorate(null, null, _peran_decorators, { kind: "field", name: "peran", static: false, private: false, access: { has: function (obj) { return "peran" in obj; }, get: function (obj) { return obj.peran; }, set: function (obj, value) { obj.peran = value; } }, metadata: _metadata }, _peran_initializers, _peran_extraInitializers);
            __esDecorate(null, null, _id_stasiun_decorators, { kind: "field", name: "id_stasiun", static: false, private: false, access: { has: function (obj) { return "id_stasiun" in obj; }, get: function (obj) { return obj.id_stasiun; }, set: function (obj, value) { obj.id_stasiun = value; } }, metadata: _metadata }, _id_stasiun_initializers, _id_stasiun_extraInitializers);
            __esDecorate(null, null, _foto_decorators, { kind: "field", name: "foto", static: false, private: false, access: { has: function (obj) { return "foto" in obj; }, get: function (obj) { return obj.foto; }, set: function (obj, value) { obj.foto = value; } }, metadata: _metadata }, _foto_initializers, _foto_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateAdminDto = UpdateAdminDto;
