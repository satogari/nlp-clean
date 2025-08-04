import { CatalogCampaignId } from "../domain/catalog-campaign-id.value-object"
import { CatalogCampaignName } from "../domain/catalog-campaign-name.value-object"
import { CatalogCampaign } from "../domain/catalog-campaign.aggregate"
import { CampaignCatalog } from "../domain/catalog-campaign.enum"
import { CampaignCatalogInvalidDateRangeError, CampaignCatalogInvalidLifecycleError, CampaignCatalogInvalidName, PartnerMissingError, PartnerNotFoundError } from "../domain/catalog-campaign.error"
import { CatalogCampaignRepository } from "../domain/catalog-campaign.repository"
import { PartnerId } from "../domain/partner-id.value-object"
import { CreateCampaignCatalogUseCaseInteractor, CreateCampaignCatalogUseCaseRequest } from "./create-campaign-catalog.usecase.interactor"
import { PartnerDataProvider } from "./port/partner-data-provider"

describe("CreateCampaignCatalog", () => {
    let inlineMemoryPartnerDataProvider: jest.Mocked<PartnerDataProvider>
    let inlineMemoryCatalogCampaignRepository: jest.Mocked<CatalogCampaignRepository>
    let usecase: CreateCampaignCatalogUseCaseInteractor
    const now = new Date()
    const nextFourteenDays = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    const nextFifteenDays = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    beforeEach(() => {
        inlineMemoryPartnerDataProvider = { findByIds: jest.fn() }
        inlineMemoryCatalogCampaignRepository = { save: jest.fn(), generateId: jest.fn() }
        usecase = new CreateCampaignCatalogUseCaseInteractor(inlineMemoryPartnerDataProvider, inlineMemoryCatalogCampaignRepository)
    })

    const validPartnerIds = ["__VALID_ID_1__"]
    const validPartnerIdObjects = [new PartnerId("__VALID_ID_1__")]

    const setupPartnerDataProvider = (partnerIds: PartnerId[]) => {
        inlineMemoryPartnerDataProvider.findByIds.mockResolvedValueOnce(partnerIds)
    }

    describe("Happy Case", () => {
        it("should return campaign successfully", async () => { 
            const request: CreateCampaignCatalogUseCaseRequest = {
                status: CampaignCatalog.Status.DRAFT,
                startDateTime: nextFourteenDays,
                endDateTime: nextFifteenDays,
                name: "__VALID_NAME__",
                partnerIds: validPartnerIds,
            }
            const expectedCatalogCampaignId = new CatalogCampaignId("__VALID_CATALOG_CAMPAIGN_ID__")
            const expectedCatalogCampaign = CatalogCampaign.create({
                id: expectedCatalogCampaignId,
                status: request.status,
                name: new CatalogCampaignName(request.name),
                startDateTime: nextFourteenDays,
                endDateTime: nextFifteenDays,
                partnerIds: request.partnerIds.map(id => new PartnerId(id))
            })
            setupPartnerDataProvider(validPartnerIdObjects)
            inlineMemoryCatalogCampaignRepository.generateId.mockResolvedValue(expectedCatalogCampaignId)
            inlineMemoryCatalogCampaignRepository.save.mockResolvedValueOnce(expectedCatalogCampaign)

            const result = await usecase.execute(request)
            expect(result.equal(expectedCatalogCampaign)).toBeTruthy
        })
    })

    describe("Edge Case", () => {
        describe("Domain Errors", () => {
            it("should throw partner not found", async () => {
                setupPartnerDataProvider([])
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: CampaignCatalog.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "__VALID_CAMPAIGN_NAME__",
                    partnerIds: []
                }
                await expect(usecase.execute(request)).rejects.toThrow(PartnerNotFoundError)
            })

            it("should throw partner missing", async () => {
                setupPartnerDataProvider(validPartnerIdObjects)
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: CampaignCatalog.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "__VALID_CAMPAIGN_NAME__",
                    partnerIds: ["__VALID_ID_1__","__VALID_ID_2__"]
                }
                await expect(usecase.execute(request)).rejects.toThrow(PartnerMissingError)
            })

            it("should throw invalid campaign lifecycle", async () => {
                setupPartnerDataProvider(validPartnerIdObjects)
                const request = {
                    partnerIds: validPartnerIds,
                    name: "__TEST_NAME__"
                } as CreateCampaignCatalogUseCaseRequest
                await expect(usecase.execute(request)).rejects.toThrow(CampaignCatalogInvalidLifecycleError)
            })

            it("should throw invalid date range", async () => {
                setupPartnerDataProvider(validPartnerIdObjects)
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: CampaignCatalog.Status.DRAFT,
                    startDateTime: thirtyDaysAgo,
                    endDateTime: nextFifteenDays,
                    name: "__TEST_NAME__",
                    partnerIds: validPartnerIds,
                }
                await expect(usecase.execute(request)).rejects.toThrow(CampaignCatalogInvalidDateRangeError)
            })

            it("should throw invalid campaign name", async () => {
                setupPartnerDataProvider(validPartnerIdObjects)
                const request: CreateCampaignCatalogUseCaseRequest = {
                    status: CampaignCatalog.Status.DRAFT,
                    startDateTime: nextFourteenDays,
                    endDateTime: nextFifteenDays,
                    name: "",
                    partnerIds: validPartnerIds,
                }
                await expect(usecase.execute(request)).rejects.toThrow(CampaignCatalogInvalidName)
            })
        })
    })
})
