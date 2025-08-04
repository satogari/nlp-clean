import { CatalogCampaignName } from "../domain/catalog-campaign-name.value-object";
import { CatalogCampaign } from "../domain/catalog-campaign.aggregate";
import { CampaignCatalog } from "../domain/catalog-campaign.enum";
import { PartnerMissingError, PartnerNotFoundError } from "../domain/catalog-campaign.error";
import { CatalogCampaignRepository } from "../domain/catalog-campaign.repository";
import { PartnerId } from "../domain/partner-id.value-object";
import { CreateCampaignCatalogUseCaseInputPort } from "./create-campaign-catalog.usecase.input-port";
import { PartnerDataProvider } from "./port/partner-data-provider";

export class CreateCampaignCatalogUseCaseRequest {
    status: CampaignCatalog.Status
    startDateTime: Date
    endDateTime: Date
    name: string
    partnerIds: string[]
}

export class CreateCampaignCatalogUseCaseInteractor implements CreateCampaignCatalogUseCaseInputPort {
    constructor(
        private partnerDataProvider: PartnerDataProvider, 
        private catalogCampaignRepository: CatalogCampaignRepository
    ){

    }
    async execute(request: CreateCampaignCatalogUseCaseRequest): Promise<CatalogCampaign> {
        const partnerIds = await this.partnerDataProvider.findByIds(request.partnerIds.map(id => new PartnerId(id)))
        
        if(this.hasNoPartner(partnerIds)){
            throw new PartnerNotFoundError
        }
        if(this.somePartnersMissing(partnerIds, request.partnerIds)){
            throw new PartnerMissingError
        }

        const toCreateCampaign = CatalogCampaign.create({
            id: await this.catalogCampaignRepository.generateId(),
            status: request.status,
            startDateTime: request.startDateTime,
            endDateTime: request.endDateTime,
            name: new CatalogCampaignName(request.name),
            partnerIds
        })

        return await this.catalogCampaignRepository.save(toCreateCampaign)
    }
    private hasNoPartner(partners: PartnerId[]): boolean {
        return partners.length === 0 ? true : false
    }
    private somePartnersMissing(partners: PartnerId[], partnerIds: string[]): boolean {
        return partners.length !== partnerIds.length
    }
}