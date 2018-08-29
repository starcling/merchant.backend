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
    "initialPaymentAmount" bigint NOT NULL,
    currency character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "numberOfPayments" integer NOT NULL,
    frequency integer NOT NULL,
    "typeID" integer NOT NULL,
    "networkID" integer DEFAULT 0,
    CONSTRAINT tb_payments_pkey PRIMARY KEY (id),
    CONSTRAINT type_id_id_fkey FOREIGN KEY ("typeID")
        REFERENCES public.tb_payment_type (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payments
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_payment_contracts
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    "hdWalletIndex" integer NOT NULL default 0,
    "paymentID" uuid NOT NULL,
    "numberOfPayments" integer NOT NULL,
    "nextPaymentDate" bigint NOT NULL,
    "lastPaymentDate" bigint DEFAULT 0,
    "startTimestamp" bigint NOT NULL,
    "customerAddress" character varying(255) COLLATE pg_catalog."default",
    "pullPaymentAddress" character varying(255) COLLATE pg_catalog."default",
    "statusID" integer DEFAULT 1,
    "userID" character varying(255) DEFAULT NULL,
    CONSTRAINT tb_payment_contracts_pkey PRIMARY KEY (id),
    CONSTRAINT payment_id_id_fkey FOREIGN KEY ("paymentID")
        REFERENCES public.tb_payments (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT status_id_id_fkey FOREIGN KEY ("statusID")
        REFERENCES public.tb_contract_status (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payment_contracts
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_blockchain_transactions
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    hash character varying(255) COLLATE pg_catalog."default" UNIQUE,
    "statusID" integer DEFAULT 1,
    "typeID" integer DEFAULT 1,
    "contractID" uuid NOT NULL,
    timestamp bigint,
    CONSTRAINT tb_blockchain_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT status_id_id_fkey FOREIGN KEY ("statusID")
        REFERENCES public.tb_transaction_status (id)
        ON UPDATE CASCADE,
    CONSTRAINT type_id_id_fkey FOREIGN KEY ("typeID")
        REFERENCES public.tb_transaction_type (id)
        ON UPDATE CASCADE,
    CONSTRAINT contract_id_id_fkey FOREIGN KEY ("contractID")
        REFERENCES public.tb_payment_contracts (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_blockchain_transactions
    OWNER to local_user;
