export class CampaignInvalidLifecycleError extends Error{
    constructor(){
        super("Invalid Campaign Lifecycle")
    }
}

export class CampaignInvalidDateRangeError extends Error {
    constructor(){
        super("Invalid Date Range Error")
    }
}
export class CampaignInvalidName extends Error {
    constructor(){
        super("Invalid Campaign Name")
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