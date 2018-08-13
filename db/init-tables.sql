CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.tb_payments
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    promo character varying(255) COLLATE pg_catalog."default",
    status integer DEFAULT 1,
    "customerAddress" character varying(255) COLLATE pg_catalog."default",
    amount bigint NOT NULL,
    currency character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "startTimestamp" bigint NOT NULL,
    "endTimestamp" bigint NOT NULL,
    "numberOfPayments" integer NOT NULL,
    "nextPaymentDate" bigint NOT NULL,
    "lastPaymentDate" bigint DEFAULT 0,
    type integer NOT NULL,
    frequency integer NOT NULL,
    "registerTxHash" character varying(255) COLLATE pg_catalog."default",
    "registerTxStatus" integer DEFAULT 1,
    "executeTxHash" character varying(255) COLLATE pg_catalog."default",
    "executeTxStatus" integer DEFAULT 1,
    "merchantAddress" character varying(255) COLLATE pg_catalog."default",
    "pullPaymentAddress" character varying(255) COLLATE pg_catalog."default",
    "userId" character varying(255) DEFAULT NULL,
    "networkID" integer DEFAULT 0,
    CONSTRAINT tb_payments_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payments
    OWNER to local_user;