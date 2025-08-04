import { CatalogCampaign } from '../domain/catalog-campaign.aggregate';

export interface CreateCampaignCatalogUseCaseOutputPort {
  writeSuccess(catalogCampaign: CatalogCampaign): void;
  writeDomainError(): void;
  writeDatabaseError(): void;
}

export const CreateCampaignCatalogUseCaseInputPort = Symbol(
  'CreateCampaignCatalogUseCaseOutputPort',
);
