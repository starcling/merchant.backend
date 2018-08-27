CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.tb_contract_status
(
    id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_contract_status_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_contract_status
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_payment_type
(
    id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_payment_type_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payment_type
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_transaction_status
(
    id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_transaction_status_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_transaction_status
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_transaction_type
(
    id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_transaction_type_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_transaction_type
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_payments
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    promo character varying(255) COLLATE pg_catalog."default",
    amount bigint NOT NULL,
    initial_payment_amount bigint NOT NULL,
    currency character varying(255) COLLATE pg_catalog."default" NOT NULL,
    number_of_payments integer NOT NULL,
    frequency integer NOT NULL,
    type_id integer NOT NULL,
    user_id character varying(255) DEFAULT NULL,
    network_id integer DEFAULT 0,
    CONSTRAINT tb_payments_pkey PRIMARY KEY (id),
    CONSTRAINT type_id_id_fkey FOREIGN KEY (type_id)
        REFERENCES public.tb_payment_type (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payments
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_blockchain_transactions
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    hash character varying(255) COLLATE pg_catalog."default",
    status_id integer DEFAULT 1,
    type_id integer DEFAULT 1,
    timestamp bigint,
    CONSTRAINT tb_blockchain_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT status_id_id_fkey FOREIGN KEY (status_id)
        REFERENCES public.tb_transaction_status (id)
        ON UPDATE CASCADE,
    CONSTRAINT type_id_id_fkey FOREIGN KEY (type_id)
        REFERENCES public.tb_transaction_type (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_blockchain_transactions
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_payment_contracts
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    hd_wallet_index integer NOT NULL default 0,
    payment_id uuid NOT NULL,
    number_of_payments integer NOT NULL,
    next_payment_date bigint NOT NULL,
    last_payment_date bigint DEFAULT 0,
    start_timestamp bigint NOT NULL,
    customer_address character varying(255) COLLATE pg_catalog."default",
    pull_payment_address character varying(255) COLLATE pg_catalog."default",
    status_id integer DEFAULT 1,
    CONSTRAINT tb_payment_contracts_pkey PRIMARY KEY (id),
    CONSTRAINT payment_id_id_fkey FOREIGN KEY (payment_id)
        REFERENCES public.tb_payments (id)
        ON UPDATE CASCADE,
    CONSTRAINT status_id_id_fkey FOREIGN KEY (status_id)
        REFERENCES public.tb_contract_status (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payment_contracts
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_contracts_transactions
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    contract_id uuid NOT NULL,
    transaction_id uuid NOT NULL,
    CONSTRAINT tb_contracts_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT contract_id_fkey FOREIGN KEY (contract_id)
        REFERENCES public.tb_payment_contracts (id)
        ON UPDATE CASCADE,
    CONSTRAINT transaction_id_fkey FOREIGN KEY (transaction_id)
        REFERENCES public.tb_blockchain_transactions (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_contracts_transactions
    OWNER to local_user;
