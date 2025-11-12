"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)({
    origin: ['https://admin-buku-tamu-mkg.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
server.options('*', (0, cors_1.default)());
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.setGlobalPrefix('api');
    return app.init();
}
exports.default = server;
bootstrap();
//# sourceMappingURL=main.js.map