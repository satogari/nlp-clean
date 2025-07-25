import { Campaign } from "./campaign.aggregate"

export interface CampaignRepository {
    findById(id: string): Promise<Campaign | null>
    save(campaign: Campaign): Promise<void>
}
export const CampaignRepository = Symbol("CampaignRepository")