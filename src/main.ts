import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/interceptor/GlobalInterceptor';
import { ResponseInterceptor } from './common/interceptor/responseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix('api', { exclude: [''] });
  console.log(`http://localhost:${port}`);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Capstone Elearning API')
    .setDescription('API documentation for Elearning Management System')
    .setVersion('1.0')
    .addBearerAuth() // Thêm xác thực Bearer Token
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persisAuthorization: true,
    },
  });
  // Lọc bỏ route mặc định GET /
  delete documentFactory.paths['/'];
  console.log(`Swagger UI is available on: http://localhost:${port}/api/docs`);
  await app.listen(port);
}
bootstrap();
