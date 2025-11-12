"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const server = (0, express_1.default)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.use((0, helmet_1.default)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60 * 1000,
        max: 100,
    }));
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                'https://admin-buku-tamu-mkg.vercel.app',
            ];
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                console.warn(`❌ Blocked by CORS: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'access_token',
            'user_id',
        ],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Buku Tamu MKG')
        .setDescription('Buku Tamu MKG API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.init();
}
bootstrap();
exports.default = server;
//# sourceMappingURL=main.js.map