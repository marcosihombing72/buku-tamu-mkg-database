"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
exports.createNestApp = createNestApp;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
require("dotenv/config");
const express_1 = __importStar(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app_module_1 = require("./app.module");
const server = (0, express_1.default)();
exports.server = server;
let nestAppPromise = null;
async function createNestApp() {
    if (!nestAppPromise) {
        nestAppPromise = (async () => {
            const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
            app.setGlobalPrefix('api');
            app.enableCors({
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                credentials: true,
            });
            app.useGlobalPipes(new common_1.ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: false,
                transform: true,
            }));
            if (process.env.LOCAL === 'true') {
                const config = new swagger_1.DocumentBuilder()
                    .setTitle('Dokumentasi API BUKU TAMU BMKG BENGKULU')
                    .setDescription('Dokumentasi API Buku Tamu BMKG Bengkulu')
                    .setVersion('1.0')
                    .addBearerAuth({
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Bearer token',
                }, 'access-token')
                    .build();
                const document = swagger_1.SwaggerModule.createDocument(app, config);
                server.use((0, express_1.json)({ limit: '10mb' }));
                server.use((0, express_1.urlencoded)({ limit: '10mb', extended: true }));
                server.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(document, {
                    customCss: `.topbar { display: none }`,
                    swaggerOptions: {
                        docExpansion: 'none',
                        defaultModelsExpandDepth: -1,
                    },
                }));
            }
            await app.init();
            return app;
        })();
    }
    return nestAppPromise;
}
if (process.env.LOCAL === 'true') {
    void createNestApp().then(() => {
        const port = Number(process.env.PORT) || 3000;
        server.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    });
}
//# sourceMappingURL=main.js.map