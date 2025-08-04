import { Campaign } from "./catalog-campaign.enum";
import { CampaignInvalidDateRangeError, CampaignInvalidLifecycleError } from "./catalog-campaign.error";

export class CreateCatalogCampaignInput  {
        status:  Campaign.Status.DRAFT
        startDateTime: Date
        endDateTime: Date
}
export class CatalogCampaign {
    public constructor(
        input: CreateCatalogCampaignInput
    ){}
    
    public static create(input: CreateCatalogCampaignInput){
        if(input.status !== Campaign.Status.DRAFT){
            throw new CampaignInvalidLifecycleError
        }
        const now = new Date()
        if(input.startDateTime >= now && input.endDateTime <= now){
            throw new CampaignInvalidDateRangeError
        }
        return new CatalogCampaign(input)
    }
}