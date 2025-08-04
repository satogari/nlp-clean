import { Campaign } from "./catalog-campaign.enum";

export class CatalogCampaign {
    constructor(private status = Campaign.Status.DRAFT){
        
    }
    
    public isDraftStatus(): boolean {
        return this.status === Campaign.Status.DRAFT
    }
}