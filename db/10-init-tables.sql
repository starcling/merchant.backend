CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.tb_payment_status
(
    id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_payment_status_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payment_status
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_payment_model_type
(
    id SERIAL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tb_payment_model_type_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payment_model_type
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

CREATE TABLE IF NOT EXISTS public.tb_payment_models
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    "merchantID" uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount bigint NOT NULL,
    "initialPaymentAmount" bigint NOT NULL,
    "trialPeriod" bigint DEFAULT 0,
    currency character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "numberOfPayments" integer NOT NULL,
    frequency integer NOT NULL,
    "typeID" integer NOT NULL,
    "networkID" integer DEFAULT 0,
    "automatedCashOut" boolean DEFAULT FALSE,
    "cashOutFrequency" integer DEFAULT 1,
    CONSTRAINT tb_payment_models_pkey PRIMARY KEY (id),
    CONSTRAINT type_id_id_fkey FOREIGN KEY ("typeID")
        REFERENCES public.tb_payment_model_type (id)
        ON UPDATE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payment_models
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.tb_payments
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    "hdWalletIndex" integer NOT NULL default 0,
    "pullPaymentModelID" uuid NOT NULL,
    "numberOfPayments" integer NOT NULL,
    "nextPaymentDate" bigint NOT NULL,
    "lastPaymentDate" bigint DEFAULT 0,
    "startTimestamp" bigint NOT NULL,
    "customerAddress" character varying(255) COLLATE pg_catalog."default",
    "merchantAddress" character varying(255) COLLATE pg_catalog."default",
    "pullPaymentAddress" character varying(255) COLLATE pg_catalog."default",
    "statusID" integer DEFAULT 1,
    "userID" character varying(255) DEFAULT NULL,
    UNIQUE ("customerAddress", "pullPaymentModelID"),
    CONSTRAINT tb_payments_pkey PRIMARY KEY (id),
    CONSTRAINT payment_model_id_id_fkey FOREIGN KEY ("pullPaymentModelID")
        REFERENCES public.tb_payment_models (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT status_id_id_fkey FOREIGN KEY ("statusID")
        REFERENCES public.tb_payment_status (id)
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
    hash character varying(255) COLLATE pg_catalog."default" UNIQUE,
    "statusID" integer DEFAULT 1,
    "typeID" integer DEFAULT 1,
    "paymentID" uuid NOT NULL,
    timestamp bigint,
    CONSTRAINT tb_blockchain_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT status_id_id_fkey FOREIGN KEY ("statusID")
        REFERENCES public.tb_transaction_status (id)
        ON UPDATE CASCADE,
    CONSTRAINT type_id_id_fkey FOREIGN KEY ("typeID")
        REFERENCES public.tb_transaction_type (id)
        ON UPDATE CASCADE,
    CONSTRAINT payment_id_id_fkey FOREIGN KEY ("paymentID")
        REFERENCES public.tb_payments (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_blockchain_transactions
    OWNER to local_user;
