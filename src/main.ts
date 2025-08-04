import { NestFactory } from '@nestjs/core';
import { CampaignModule } from './campaign/campaign.module';

async function bootstrap() {
  const app = await NestFactory.create(CampaignModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
