export class CampaignCatalogInvalidIdFormatError extends Error {
    constructor(){
        super("Invalid Campaign Catalog Id Format")
    }
}
export class CampaignCatalogInvalidLifecycleError extends Error{
    constructor(){
        super("Invalid Campaign Catalog Lifecycle")
    }
}

export class CampaignCatalogInvalidDateRangeError extends Error {
    constructor(){
        super("Invalid Date Range Error")
    }
}
export class CampaignCatalogInvalidName extends Error {
    constructor(){
        super("Invalid Campaign Catalog Name")
    }
}

export class PartnerNotFoundError extends Error {
    constructor(){
        super("Partner Not Found Error")
    }
}
export class PartnerInvalidIdFormatError extends Error {
    constructor(){
        super("Partner Invalid Id Format Error")
    }
}
export class PartnerMissingError extends Error {
    constructor(){
        super("Partner Missing Error")
    }
}