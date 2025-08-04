import { CatalogCampaign } from '../domain/catalog-campaign.aggregate';
import { CreateCampaignCatalogUseCaseRequest } from './create-campaign-catalog.usecase.interactor';

export interface CreateCampaignCatalogUseCaseInputPort {
  execute(
    request: CreateCampaignCatalogUseCaseRequest,
  ): Promise<CatalogCampaign>;
}

export const CreateCampaignCatalogUseCaseInputPort = Symbol(
  'CreateCampaignCatalogUseCaseInputPort',
);
