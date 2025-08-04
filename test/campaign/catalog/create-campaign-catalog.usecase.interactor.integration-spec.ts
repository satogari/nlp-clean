import { Client } from "pg";
import { CreateCampaignCatalogUseCaseInteractor } from "src/campaign/catalog/application/create-campaign-catalog.usecase.interactor";
import { PartnerDataProvider } from "src/campaign/catalog/application/port/partner-data-provider";
import { CampaignCatalog } from "src/campaign/catalog/domain/catalog-campaign.enum";
import { PartnerId } from "src/campaign/catalog/domain/partner-id.value-object";
import { CampaignCatalogPostgreSQLRepository } from "src/campaign/catalog/infrastructure/database/campaign-catalog.postgresql.repository";
import { TestDatabaseUtils } from "test/utils/database-test.util";

describe('CreateCampaignCatalog Integration Tests', () => {
    let client: Client;
    let repository: CampaignCatalogPostgreSQLRepository;
    let createCatalogCampaignUseCaseInteractor: CreateCampaignCatalogUseCaseInteractor;
    let partnerDataProvider: jest.Mocked<PartnerDataProvider> = {
        findByIds: jest.fn(),
    };

    beforeAll(async () => {
        client = new Client({
            host: 'localhost',
            port: 5432,
            database: 'your_database',
            user: 'your_user',
            password: 'your_password',
        });

        await new TestDatabaseUtils(client).connect();
        await new TestDatabaseUtils(client).setupTestDatabase();
        repository = new CampaignCatalogPostgreSQLRepository(client);
        createCatalogCampaignUseCaseInteractor = new CreateCampaignCatalogUseCaseInteractor(partnerDataProvider, repository);
    });

    afterAll(async () => {
        await client.end();
    });
    it('should create a campaign catalog successfully', async () => {
        const request = {
            status: CampaignCatalog.Status.DRAFT,
            startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            endDateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
            name: 'Test Campaign',
            partnerIds: ['partner1'],
        };

        partnerDataProvider.findByIds.mockResolvedValueOnce([new PartnerId('partner1')]);

        const result = await createCatalogCampaignUseCaseInteractor.execute(request);

        expect(result).toBeDefined();
        expect(result.Id).toBeDefined();
        expect(result.Name.value).toBe(request.name);
        expect(result.Status).toBe(CampaignCatalog.Status.DRAFT);
        expect(result.StartDateTime.getTime()).toBeGreaterThan(Date.now());
        expect(result.EndDateTime.getTime()).toBeGreaterThan(result.StartDateTime.getTime());
        expect(result.PartnerIds.length).toBe(1);
        expect(result.PartnerIds[0].value).toBe('partner1');
    });
});