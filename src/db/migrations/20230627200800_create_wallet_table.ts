import {Knex} from 'knex'

export async function up(knex: Knex) {
    await knex.raw (
        `CREATE TABLE IF NOT EXISTS wallet (
            wallet_id bigserial,
            user_id BIGINT NOT NULL UNIQUE,
            min_amount DOUBLE PRECISION NOT NULL,
            max_amount DOUBLE PRECISION,
            amount DOUBLE PRECISION,
            status VARCHAR,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ,
            PRIMARY KEY (wallet_id)
        );
        
        CREATE TABLE IF NOT EXISTS transaction (
            transaction_id bigserial,
            wallet_id BIGINT NOT NULL,
            type VARCHAR NOT NULL,
            payee VARCHAR,
            amount DOUBLE PRECISION,
            status VARCHAR,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ,
            PRIMARY KEY (transaction_id),
            CONSTRAINT fk_transaction
            FOREIGN KEY (wallet_id)
            REFERENCES wallet(wallet_id)
        );
        
        `
    )
    
}

export async function down(knex: Knex) {
    await knex.raw(
        `
        DROP TABLE wallet;
        DROP TABLE transaction;
        `
    )
    
}