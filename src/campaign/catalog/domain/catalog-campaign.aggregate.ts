import { CatalogCampaignId } from './catalog-campaign-id.value-object';
import { CatalogCampaignName } from './catalog-campaign-name.value-object';
import { CampaignCatalog } from './catalog-campaign.enum';
import {
  CampaignCatalogInvalidDateRangeError,
  CampaignCatalogInvalidLifecycleError,
} from './catalog-campaign.error';
import { PartnerId } from './partner-id.value-object';

export class CreateCatalogCampaignInput {
  id: CatalogCampaignId;
  name: CatalogCampaignName;
  status: CampaignCatalog.Status.DRAFT;
  startDateTime: Date;
  endDateTime: Date;
  partnerIds: PartnerId[];
}
export class CatalogCampaign {
  constructor(
    private id: CatalogCampaignId,
    private name: CatalogCampaignName,
    private status: CampaignCatalog.Status,
    private startDateTime: Date,
    private endDateTime: Date,
    private partnerIds: PartnerId[],
  ) {}

  public static create(input: CreateCatalogCampaignInput) {
    if (input.status !== CampaignCatalog.Status.DRAFT) {
      throw new CampaignCatalogInvalidLifecycleError();
    }
    const now = new Date();
    if (
      !(input.startDateTime.getTime() > now.getTime()) ||
      !(input.startDateTime.getTime() < input.endDateTime.getTime())
    ) {
      throw new CampaignCatalogInvalidDateRangeError();
    }
    return new CatalogCampaign(
      input.id,
      input.name,
      input.status,
      input.startDateTime,
      input.endDateTime,
      input.partnerIds,
    );
  }
  get Id() {
    return this.id;
  }
  public equal(catalogCampaign: CatalogCampaign): boolean {
    return catalogCampaign.Id === this.id;
  }
}
