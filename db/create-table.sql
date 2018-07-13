CREATE TABLE IF NOT EXISTS public.payments
(
    id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    promo character varying(255),
    status integer NOT NULL,
    "customerAddress" character varying(255),
    amount numeric NOT NULL,
    currency character varying(255) NOT NULL,
    "startTS" bigint NOT NULL,
    "endTS" bigint NOT NULL,
    type integer NOT NULL,
    frequency integer NOT NULL,
    "transactionHash" character varying(255),
    "debitAccount" character varying(255),
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.payments
    OWNER to local_user;