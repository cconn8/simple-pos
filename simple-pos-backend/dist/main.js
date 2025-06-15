"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('NODE_ENV is:', process.env.NODE_ENV);
    console.log(`Loading env file: .env.${process.env.NODE_ENV}`);
    app.enableCors();
    await app.listen(3005);
}
bootstrap();
//# sourceMappingURL=main.js.map