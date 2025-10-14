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
exports.CreateLokasiDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateLokasiDto = function () {
    var _a;
    var _nama_decorators;
    var _nama_initializers = [];
    var _nama_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateLokasiDto() {
                this.nama = __runInitializers(this, _nama_initializers, void 0);
                this.latitude = (__runInitializers(this, _nama_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                __runInitializers(this, _longitude_extraInitializers);
            }
            return CreateLokasiDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nama_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Stasiun Meteorologi Bengkulu',
                    description: 'Nama lokasi',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({
                    example: -3.795555,
                    description: 'Latitude lokasi dalam format desimal',
                }), (0, class_validator_1.IsNumber)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({
                    example: 102.259167,
                    description: 'Longitude lokasi dalam format desimal',
                }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _nama_decorators, { kind: "field", name: "nama", static: false, private: false, access: { has: function (obj) { return "nama" in obj; }, get: function (obj) { return obj.nama; }, set: function (obj, value) { obj.nama = value; } }, metadata: _metadata }, _nama_initializers, _nama_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateLokasiDto = CreateLokasiDto;
