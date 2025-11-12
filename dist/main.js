"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use((0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 100 }));
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Buku Tamu MKG')
        .setDescription('Buku Tamu MKG')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map