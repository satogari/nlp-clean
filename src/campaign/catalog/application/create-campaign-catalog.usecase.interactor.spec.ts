import { Campaign } from "../domain/catalog-campaign.enum"
import { CampaignInvalidDateRangeError, CampaignInvalidLifecycleError, CampaignInvalidName, PartnerMissingError, PartnerNotFoundError } from "../domain/catalog-campaign.error"
import { PartnerId } from "../domain/partner-id.value-object"
import { CreateCampaignCatalogUseCaseInteractor, CreateCampaignCatalogUseCaseRequest } from "./create-campaign-catalog.usecase.interactor"
import { PartnerDataProvider } from "./port/partner-data-provider"

describe("CreateCampaignCatalog", () => {
    const inlineMemoryPartnerDataProvider: jest.Mocked<PartnerDataProvider> = {
        findByIds: jest.fn()
    }
    describe("Edge Case", () => {
        describe("Domain Errors", () => {
            it("should throw invalid campaign lifecycle", () => {
                const request = {
                    name: "__TEST_NAME__"
                } as CreateCampaignCatalogUseCaseRequest
                const usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider)
                const result = () => usecase.execute(request)
                expect(result).rejects.toThrow(CampaignInvalidLifecycleError)
            })
            it("should throw invalid date range", () => {
                const now = new Date()
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                const nextFifteenDays = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: thirtyDaysAgo,
                    endDateTime: nextFifteenDays,
                    name: "__TEST_NAME__",
                    partnerIds: []
                }
                const usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider)
                const result = () => usecase.execute(request)
                expect(result).rejects.toThrow(CampaignInvalidDateRangeError)
            })
            it("should throw invalid campaign name" , () => {
                const now = new Date()
                const nextFourteenDays = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
                const nextFifteenDays = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "",
                    partnerIds: []
                }
                const usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider)
                const result = () => usecase.execute(request)
                expect(result).rejects.toThrow(CampaignInvalidName)
            })
            it("should throw partner not found", () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce([])
                const now = new Date()
                const nextFourteenDays = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
                const nextFifteenDays = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "__VALID_CAMPAIGN_NAME__",
                    partnerIds: []
                }
                const usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider)
                const result =  () => usecase.execute(request)
                expect(result).rejects.toThrow(PartnerNotFoundError)
            })
            it("should throw partner missing", () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce(
                    [
                        new PartnerId("__VALID_ID_1__"),
                    ]
                )
                const now = new Date()
                const nextFourteenDays = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
                const nextFifteenDays = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "__VALID_CAMPAIGN_NAME__",
                    partnerIds: ["__VALID_ID_1__","__VALID_ID_2__"]
                }
                const usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider)
                const result =  () => usecase.execute(request)
                expect(result).rejects.toThrow(PartnerMissingError)
            })
        })
    })
})