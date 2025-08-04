import { PartnerInvalidIdFormatError } from './catalog-campaign.error';

export class PartnerId {
  constructor(private id: string) {
    this.validate(id);
  }
  private validate(id: string) {
    if (id.length < 5) {
      throw new PartnerInvalidIdFormatError();
    }
  }
  get value(): string {
    return this.id;
  }
}
