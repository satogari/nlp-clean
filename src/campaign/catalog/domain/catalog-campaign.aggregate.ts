import { CatalogCampaignName } from "./catalog-campaign-name.value-object";
import { Campaign } from "./catalog-campaign.enum";
import { CampaignInvalidDateRangeError, CampaignInvalidLifecycleError } from "./catalog-campaign.error";

export class CreateCatalogCampaignInput  {
        name: CatalogCampaignName
        status:  Campaign.Status.DRAFT
        startDateTime: Date
        endDateTime: Date
}
export class CatalogCampaign {
    private constructor(
        private name: CatalogCampaignName,
        private status: Campaign.Status,
        private startDateTime: Date,
        private endDateTime: Date,
    ){}
    
    public static create(input: CreateCatalogCampaignInput){
        if(input.status !== Campaign.Status.DRAFT){
            throw new CampaignInvalidLifecycleError
        }
        const now = new Date()
        if(!(input.startDateTime.getTime() > now.getTime()) || !(input.startDateTime.getTime() < input.endDateTime.getTime())){
            throw new CampaignInvalidDateRangeError
        }
        return new CatalogCampaign(input.name, input.status, input.startDateTime, input.endDateTime)
    }
}