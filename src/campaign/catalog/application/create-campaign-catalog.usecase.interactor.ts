import { CatalogCampaign } from "../domain/catalog-campaign.aggregate";
import { Campaign } from "../domain/catalog-campaign.enum";
import { CreateCampaignCatalogUseCaseInputPort } from "./create-campaign-catalog.usecase.input-port";

export class CreateCampaignCatalogUseCaseRequest {
    status: Campaign.Status
    startDateTime: Date
    endDateTime: Date
}

export class CreateCampaignCatalogUseCaseInteractor implements CreateCampaignCatalogUseCaseInputPort{
    async execute(request: CreateCampaignCatalogUseCaseRequest): Promise<CatalogCampaign> {
        const createdCampaign = CatalogCampaign.create({
            status: request.status,
            startDateTime: request.startDateTime,
            endDateTime: request.endDateTime
        })
        return createdCampaign
    }
}