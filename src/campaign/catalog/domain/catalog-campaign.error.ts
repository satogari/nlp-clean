import { DomainError } from "./domain.error";

export class CampaignCatalogInvalidIdFormatError extends DomainError {
  constructor() {
    super('Invalid Campaign Catalog Id Format');
  }
}
export class CampaignCatalogInvalidLifecycleError extends DomainError {
  constructor() {
    super('Invalid Campaign Catalog Lifecycle');
  }
}

export class CampaignCatalogInvalidDateRangeError extends DomainError {
  constructor() {
    super('Invalid Date Range DomainError');
  }
}
export class CampaignCatalogInvalidName extends DomainError {
  constructor() {
    super('Invalid Campaign Catalog Name');
  }
}

export class PartnerNotFoundError extends DomainError {
  constructor() {
    super('Partner Not Found DomainError');
  }
}
export class PartnerInvalidIdFormatError extends DomainError {
  constructor() {
    super('Partner Invalid Id Format DomainError');
  }
}
export class PartnerMissingError extends DomainError {
  constructor() {
    super('Partner Missing DomainError');
  }
}
