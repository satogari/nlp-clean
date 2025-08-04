import { Campaign } from "../domain/catalog-campaign.enum"
import { CampaignInvalidDateRangeError, CampaignInvalidLifecycleError } from "../domain/catalog-campaign.error"
import { CreateCampaignCatalogUseCaseInteractor, CreateCampaignCatalogUseCaseRequest } from "./create-campaign-catalog.usecase.interactor"

describe("CreateCampaignCatalog", () => {
    describe("Edge Case", () => {
        describe("Domain Errors", () => {
            it("should throw invalid campaign lifecycle", () => {
                const request = {} as CreateCampaignCatalogUseCaseRequest
                const usecase = new CreateCampaignCatalogUseCaseInteractor()
                const result = usecase.execute(request)
                expect(result).rejects.toThrow(CampaignInvalidLifecycleError)
            })
            it("should throw invalid date range", () => {
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: new Date(),
                    endDateTime: new Date(),
                }
                const usecase = new CreateCampaignCatalogUseCaseInteractor()
                const result = usecase.execute(request)
                expect(result).rejects.toThrow(CampaignInvalidDateRangeError)
            })
        })
    })
})