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
    if (!CatalogCampaign.isDraft(input.status)) {
      throw new CampaignCatalogInvalidLifecycleError();
    }
    if (
      !CatalogCampaign.isValidDateRange(input.startDateTime, input.endDateTime)
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
  private static isDraft(status: CampaignCatalog.Status): boolean {
    return status === CampaignCatalog.Status.DRAFT;
  }
  private static isValidDateRange(
    startDateTime: Date,
    endDateTime: Date,
  ): boolean {
    const now = new Date();
    return (
      startDateTime.getTime() > now.getTime() &&
      startDateTime.getTime() < endDateTime.getTime()
    );
  }
  public equal(catalogCampaign: CatalogCampaign): boolean {
    return catalogCampaign.Id === this.id;
  }
  get Id() {
    return this.id;
  }
  get Name() {
    return this.name;
  }
  get Status() {
    return this.status;
  }
  get StartDateTime() {
    return this.startDateTime;
  }
  get EndDateTime() {
    return this.endDateTime;
  }
  get PartnerIds() {
    return this.partnerIds;
  }
}
