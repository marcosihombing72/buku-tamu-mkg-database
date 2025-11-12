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
server.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'https://admin-buku-tamu-mkg.vercel.app',
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access_token, user_id');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
server.set('trust proxy', 1);
server.use((0, helmet_1.default)());
server.use((0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 100,
}));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:3000', 'https://admin-buku-tamu-mkg.vercel.app'],
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
        credentials: true,
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