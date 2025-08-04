import { CampaignCatalogInvalidName } from './catalog-campaign.error';

export class CatalogCampaignName {
  constructor(name: string) {
    this.validate(name);
  }
  private validate(name: string) {
    if (name.length === 0) {
      throw new CampaignCatalogInvalidName();
    }
  }
}
