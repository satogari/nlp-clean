import { CampaignInvalidLifecycleError } from "../domain/catalog-campaign.error"
import { CreateCampaignCatalogUseCaseInteractor, CreateCampaignCatalogUseCaseRequest } from "./create-campaign-catalog.usecase.interactor"

describe("CreateCampaignCatalog", () => {
    describe("Edge Case", () => {
        describe("Domain Errors", () => {
            it("should throw invalid campaign lifecycle", () => {
               const request = new CreateCampaignCatalogUseCaseRequest()
               const usecase = new CreateCampaignCatalogUseCaseInteractor()
               const result = usecase.execute(request)
               expect(result).rejects.toThrow(CampaignInvalidLifecycleError) 
            })
        })
    })
})