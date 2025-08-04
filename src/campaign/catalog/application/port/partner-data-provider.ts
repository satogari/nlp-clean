import { PartnerId } from "../../domain/partner-id.value-object";

export interface PartnerDataProvider {
    findByIds(partnerIds: PartnerId[]): Promise<PartnerId[]>
}