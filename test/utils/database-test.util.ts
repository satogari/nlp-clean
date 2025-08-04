import { Client, ClientConfig } from 'pg';

interface TableRow {
    tablename: string;
}

export class TestDatabaseUtils {
    constructor(private client: Client) {}

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.end();
    }

    async dropAllTables(): Promise<void> {
        try {
            const tablesResult = await this.client.query<TableRow>(`
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public'
            `);
            
            if (tablesResult.rows.length === 0) {
                return;
            }
            
            const tableNames = tablesResult.rows.map(row => row.tablename);
            const dropQuery = `DROP TABLE IF EXISTS ${tableNames.map(name => `"${name}"`).join(', ')} CASCADE;`;
            await this.client.query(dropQuery);
            
        } catch (error) {
            console.error('Drop tables failed:', error);
            throw error;
        }
    }

    async createTables(): Promise<void> {
        try {
            await this.client.query(`
                CREATE TABLE IF NOT EXISTS migrations (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            await this.client.query(`
                CREATE TABLE IF NOT EXISTS campaign_catalog (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    start_date_time TIMESTAMP NOT NULL,
                    end_date_time TIMESTAMP NOT NULL,
                    status VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT check_end_after_start CHECK (end_date_time > start_date_time)
                );
                
                CREATE INDEX IF NOT EXISTS idx_campaign_catalog_dates ON campaign_catalog(start_date_time, end_date_time);
                CREATE INDEX IF NOT EXISTS idx_campaign_catalog_name ON campaign_catalog(name);
            `);

            await this.client.query(`
                CREATE TABLE IF NOT EXISTS partner (
                    id VARCHAR(255) PRIMARY KEY,
                    campaign_id VARCHAR(255) NOT NULL,
                    partner_id VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT unique_campaign_partner 
                        UNIQUE (campaign_id, partner_id)
                );
                
                CREATE INDEX IF NOT EXISTS idx_partner_campaign_id ON partner(campaign_id);
                CREATE INDEX IF NOT EXISTS idx_partner_partner_id ON partner(partner_id);
            `);

        } catch (error) {
            console.error('Create tables failed:', error);
            throw error;
        }
    }

    async setupTestDatabase(): Promise<void> {
        await this.dropAllTables();
        await this.createTables();
    }

    async clearAllData(): Promise<void> {
        try {
            const tablesResult = await this.client.query<TableRow>(`
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public'
                AND tablename != 'migrations'
            `);
            
            for (const row of tablesResult.rows) {
                await this.client.query(`TRUNCATE TABLE "${row.tablename}" RESTART IDENTITY CASCADE;`);
            }
            
        } catch (error) {
            console.error('Clear data failed:', error);
            throw error;
        }
    }
}