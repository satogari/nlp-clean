import { CampaignCatalogInvalidIdFormatError } from "./catalog-campaign.error"

export class CatalogCampaignId {
    constructor(private id:string){
        this.validate(id)
    }
    private validate(id:string) {
        if(id.length <5){
            throw new CampaignCatalogInvalidIdFormatError
        }
    }
    public equal(value: CatalogCampaignId): boolean {
        return this.id === value.Id
    }
    get Id() {
        return this.id
    }
}