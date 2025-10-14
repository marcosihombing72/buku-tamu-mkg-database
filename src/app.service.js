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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
var common_1 = require("@nestjs/common");
var AppService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppService = _classThis = /** @class */ (function () {
        function AppService_1() {
        }
        AppService_1.prototype.getHome = function () {
            return /* html */ "\n      <!DOCTYPE html>\n      <html lang=\"id\">\n        <head>\n          <meta charset=\"UTF-8\" />\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n          <title>Buku Tamu MKG</title>\n          <link\n            rel=\"icon\"\n            type=\"image/x-icon\"\n            href=\"https://img.icons8.com/fluency/48/api.png\"\n          />\n          <style>\n            body {\n              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n              background: linear-gradient(to right, #0f2027, #203a43, #2c5364);\n              color: white;\n              display: flex;\n              flex-direction: column;\n              align-items: center;\n              justify-content: center;\n              height: 100vh;\n              margin: 0;\n              text-align: center;\n            }\n\n            h1 {\n              font-size: 3rem;\n              margin-bottom: 0.5rem;\n            }\n\n            p {\n              font-size: 1.2rem;\n              max-width: 600px;\n            }\n\n            a {\n              margin-top: 1.5rem;\n              padding: 10px 20px;\n              background-color: #00b894;\n              color: white;\n              border-radius: 8px;\n              text-decoration: none;\n              font-weight: bold;\n              transition: background 0.3s ease;\n            }\n\n            a:hover {\n              background-color: #019875;\n            }\n          </style>\n        </head>\n\n        <body>\n          <h1>\uD83D\uDE80 Buku Tamu MKG</h1>\n          <p>Selamat datang! Gunakan tombol di bawah untuk membuka dokumentasi API.</p>\n          <a href=\"/api\">\uD83D\uDCC4 Lihat Dokumentasi</a>\n        </body>\n      </html>\n    ";
        };
        return AppService_1;
    }());
    __setFunctionName(_classThis, "AppService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppService = _classThis;
}();
exports.AppService = AppService;
