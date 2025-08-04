import { Campaign } from "../domain/catalog-campaign.enum"
import { CampaignInvalidDateRangeError, CampaignInvalidLifecycleError, CampaignInvalidName, PartnerMissingError, PartnerNotFoundError } from "../domain/catalog-campaign.error"
import { PartnerId } from "../domain/partner-id.value-object"
import { CreateCampaignCatalogUseCaseInteractor, CreateCampaignCatalogUseCaseRequest } from "./create-campaign-catalog.usecase.interactor"
import { PartnerDataProvider } from "./port/partner-data-provider"

describe("CreateCampaignCatalog", () => {
    let inlineMemoryPartnerDataProvider: jest.Mocked<PartnerDataProvider>
    let usecase: CreateCampaignCatalogUseCaseInteractor
    const now = new Date()
    const nextFourteenDays = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    const nextFifteenDays = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    beforeEach(() => {
        inlineMemoryPartnerDataProvider = { findByIds: jest.fn() }
        usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider)
    })

    describe("Edge Case", () => {
        describe("Domain Errors", () => {
            it("should throw partner not found", async () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce([])
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "__VALID_CAMPAIGN_NAME__",
                    partnerIds: []
                }
                await expect(usecase.execute(request)).rejects.toThrow(PartnerNotFoundError)
            })

            it("should throw partner missing", async () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce([
                    new PartnerId("__VALID_ID_1__"),
                ])
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "__VALID_CAMPAIGN_NAME__",
                    partnerIds: ["__VALID_ID_1__","__VALID_ID_2__"]
                }
                await expect(usecase.execute(request)).rejects.toThrow(PartnerMissingError)
            })

            it("should throw invalid campaign lifecycle", async () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce([
                    new PartnerId("__VALID_ID_1__"),
                ])
                const request = {
                    partnerIds: ["__VALID_ID_1__"],
                    name: "__TEST_NAME__"
                } as CreateCampaignCatalogUseCaseRequest
                await expect(usecase.execute(request)).rejects.toThrow(CampaignInvalidLifecycleError)
            })

            it("should throw invalid date range", async () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce([
                    new PartnerId("__VALID_ID_1__"),
                ])
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: thirtyDaysAgo,
                    endDateTime: nextFifteenDays,
                    name: "__TEST_NAME__",
                    partnerIds: ["__VALID_ID_1__"],
                }
                await expect(usecase.execute(request)).rejects.toThrow(CampaignInvalidDateRangeError)
            })

            it("should throw invalid campaign name", async () => {
                inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce([
                    new PartnerId("__VALID_ID_1__"),
                ])
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: Campaign.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "",
                    partnerIds: ["__VALID_ID_1__"],
                }
                await expect(usecase.execute(request)).rejects.toThrow(CampaignInvalidName)
            })
        })
    })
})
