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