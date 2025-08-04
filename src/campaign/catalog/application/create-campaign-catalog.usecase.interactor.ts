import { CatalogCampaign } from "../domain/catalog-campaign.aggregate";
import { Campaign } from "../domain/catalog-campaign.enum";
import { CampaignInvalidLifecycleError } from "../domain/catalog-campaign.error";
import { CreateCampaignCatalogUseCaseInputPort } from "./create-campaign-catalog.usecase.input-port";

export class CreateCampaignCatalogUseCaseRequest {
    status: Campaign.Status
}

export class CreateCampaignCatalogUseCaseInteractor implements CreateCampaignCatalogUseCaseInputPort{
    async execute(request: CreateCampaignCatalogUseCaseRequest): Promise<CatalogCampaign> {
        const createdCampaign = new CatalogCampaign(request.status)
        if(createdCampaign.isDraftStatus()){
            throw new CampaignInvalidLifecycleError()
        }
        return createdCampaign
    }
}