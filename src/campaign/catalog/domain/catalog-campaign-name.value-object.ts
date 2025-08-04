import { CampaignCatalogInvalidName } from './catalog-campaign.error';

export class CatalogCampaignName {
  constructor(private name: string) {
    this.validate(name);
  }
  private validate(name: string) {
    if (name.length === 0) {
      throw new CampaignCatalogInvalidName();
    }
  }
  get value(): string {
    return this.name;
  }
}
