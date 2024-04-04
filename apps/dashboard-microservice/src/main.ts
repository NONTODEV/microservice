import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import timetoday from 'dayjs/plugin/isToday';
import { configureSwaggerAndPipesAdmin } from '@lib/commom/swagger';

dayjs.extend(timezone);
dayjs.extend(timetoday);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('dashboard.port');
  const provider = configService.get<string>('dashboar.provider');
  const logger = new Logger();

  if (process.env.NODE_ENV !== 'production') {
    configureSwaggerAndPipesAdmin(app);
  }

  app.startAllMicroservices();
  await app.listen(port, () => {
    logger.log(`
      Application ${provider} started listen on port ${port}
      Local Timezone guess: ${dayjs.tz.guess()}
      Local Date: ${dayjs().toDate().toISOString()} ~ ${dayjs().format(
        'YYYY-MM-DD HH:mm:ss',
      )}
    `);
  });
}
bootstrap();
