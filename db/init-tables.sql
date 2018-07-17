CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.tb_payments
(
    id uuid NOT NULL DEFAULT uuid_generate_v1mc(),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    promo character varying(255) COLLATE pg_catalog."default",
    status integer NOT NULL,
    "customerAddress" character varying(255) COLLATE pg_catalog."default",
    amount bigint NOT NULL,
    currency character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "startTS" bigint NOT NULL,
    "endTS" bigint NOT NULL,
    type integer NOT NULL,
    frequency integer NOT NULL,
    "transactionHash" character varying(255) COLLATE pg_catalog."default",
    "debitAccount" character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT tb_payments_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tb_payments
    OWNER to local_user;