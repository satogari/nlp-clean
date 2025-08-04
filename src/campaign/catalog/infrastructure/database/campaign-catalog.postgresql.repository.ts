import { Client } from 'pg';
import { CatalogCampaignId } from "../../domain/catalog-campaign-id.value-object";
import { CatalogCampaign } from "../../domain/catalog-campaign.aggregate";
import { CatalogCampaignRepository } from "../../domain/catalog-campaign.repository";
import { CatalogCampaignName } from '../../domain/catalog-campaign-name.value-object';
import { DatabaseError } from './database.error';
import { randomUUID } from 'node:crypto';

export class CampaignCatalogPostgreSQLRepository implements CatalogCampaignRepository {
  constructor(
    private readonly client: Client
  ){}
  async save(campaign: CatalogCampaign): Promise<CatalogCampaign> {
    try{
        const query = `INSERT INTO campaign_catalog (id, name, status, start_date_time, end_date_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, status, start_date_time, end_date_time;`;
        const values = [
            campaign.Id.value,
            campaign.Name.value,
            campaign.Status,
            campaign.StartDateTime,
            campaign.EndDateTime,
        ];
        const result = await this.client.query(query, values);
        const row = result.rows[0];
        const queryPartner = `INSERT INTO partner (id, campaign_id, partner_id)
      VALUES ($1, $2, $3)
      RETURNING campaign_id, partner_id;`;
      await this.client.query(queryPartner, [randomUUID(), row.id, ...campaign.PartnerIds.map(p => p.value)]);
      await this.client.query('COMMIT');
      return CatalogCampaign.create({
        id: new CatalogCampaignId(row.id),
        name: new CatalogCampaignName(row.name),
        status: row.status,
        startDateTime: row.start_date_time,
        endDateTime: row.end_date_time,
        partnerIds: campaign.PartnerIds,
      });   
    }catch(error){
        await this.client.query('ROLLBACK');
        throw new DatabaseError(error); // Encapsulate the error to its specific layer
    } finally {
      await this.client.end();
    }
  }
  async generateId(): Promise<CatalogCampaignId> {
    return new CatalogCampaignId(randomUUID());
  }
}