import { CatalogCampaignId } from "./catalog-campaign-id.value-object"
import { CatalogCampaign } from "./catalog-campaign.aggregate"

export interface CatalogCampaignRepository {
    generateId(): Promise<CatalogCampaignId>
    save(catalogCampaign:CatalogCampaign): Promise<CatalogCampaign>
}

export const CatalogCampaignRepository = Symbol("CatalogCampaignRepository")