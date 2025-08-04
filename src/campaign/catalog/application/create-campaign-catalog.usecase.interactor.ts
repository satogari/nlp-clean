import { CatalogCampaignName } from "../domain/catalog-campaign-name.value-object";
import { CatalogCampaign } from "../domain/catalog-campaign.aggregate";
import { Campaign } from "../domain/catalog-campaign.enum";
import { PartnerMissingError, PartnerNotFoundError } from "../domain/catalog-campaign.error";
import { PartnerId } from "../domain/partner-id.value-object";
import { CreateCampaignCatalogUseCaseInputPort } from "./create-campaign-catalog.usecase.input-port";
import { PartnerDataProvider } from "./port/partner-data-provider";

export class CreateCampaignCatalogUseCaseRequest {
    status: Campaign.Status
    startDateTime: Date
    endDateTime: Date
    name: string
    partnerIds: string[]
}

export class CreateCampaignCatalogUseCaseInteractor implements CreateCampaignCatalogUseCaseInputPort {
    constructor(private partnerDataProvider: PartnerDataProvider){

    }
    async execute(request: CreateCampaignCatalogUseCaseRequest): Promise<CatalogCampaign> {
        const partners = await this.partnerDataProvider.findByIds(request.partnerIds.map(id => new PartnerId(id)))
        
        if(!this.hasPartner(partners)){
            throw new PartnerNotFoundError
        }
        if(this.somePartnersMissing(partners, request.partnerIds)){
            throw new PartnerMissingError
        }
        
        const createdCampaign = CatalogCampaign.create({
            status: request.status,
            startDateTime: request.startDateTime,
            endDateTime: request.endDateTime,
            name: new CatalogCampaignName(request.name)
        })
        
        return createdCampaign
    }
    private hasPartner(partners: PartnerId[]): boolean {
        return partners.length === 0 ? false : true
    }
    private somePartnersMissing(partners: PartnerId[], partnerIds: string[]): boolean {
        return partners.length !== partnerIds.length
    }
}