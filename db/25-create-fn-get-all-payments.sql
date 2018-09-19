-- FUNCTION: public.fc_get_payment_by_ids()

-- DROP FUNCTION public.fc_get_payment_by_ids();

CREATE OR REPLACE FUNCTION public.fc_get_payment_by_ids()
    RETURNS TABLE (
        id uuid,
        title character varying (255),
        "merchantID" uuid,
        description character varying (255),
        promo character varying (255),
        amount bigint,
        "initialPaymentAmount" bigint,
        "trialPeriod" bigint,
        currency character varying (255),
        "hdWalletIndex" integer,
        "numberOfPayments" integer,
        frequency integer,
        type character varying (255),
        status character varying (255),
        "networkID" integer,
        "nextPaymentDate" bigint,
        "lastPaymentDate" bigint,
        "startTimestamp" bigint,
        "customerAddress" character varying (255),
        "merchantAddress" character varying (255),
        "pullPaymentAddress" character varying (255),
        "userID" character varying (255)
    )
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN

    RETURN 
    QUERY (SELECT 
        public.tb_payments.id as id,
        public.tb_payment_models.title as title,
        public.tb_payment_models."merchantID" as merchantID,
        public.tb_payment_models.description as description,
        public.tb_payment_models.promo as promo,
        public.tb_payment_models.amount as amount,
        public.tb_payment_models."initialPaymentAmount" as initialPaymentAmount,
        public.tb_payment_models."trialPeriod" as trialPeriod,
        public.tb_payment_models.currency as currency,
        public.tb_payments."hdWalletIndex" as hdWalletIndex,
        public.tb_payments."numberOfPayments" as numberOfPayments,
        public.tb_payment_models.frequency as frequency,
        public.tb_payment_model_type.name as type,
        public.tb_payment_status.name as status,
        public.tb_payment_models."networkID" as networkID,
        public.tb_payments."nextPaymentDate" as nextPaymentDate,
        public.tb_payments."lastPaymentDate" as lastPaymentDate,
        public.tb_payments."startTimestamp" as startTimestamp,
        public.tb_payments."customerAddress" as customerAddress,
        public.tb_payments."merchantAddress" as merchantAddress,
        public.tb_payments."pullPaymentAddress" as pullPaymentAddress,
        public.tb_payments."userID" as userID
    FROM (public.tb_payments
    JOIN public.tb_payment_models ON public.tb_payments."paymentModelID" = public.tb_payment_models.id
    JOIN public.tb_payment_model_type ON public.tb_payment_models."typeID" = public.tb_payment_model_type.id
    JOIN public.tb_payment_status ON public.tb_payments."statusID" = public.tb_payment_status.id));

END

$BODY$;

ALTER FUNCTION public.fc_get_payment_by_ids()
    OWNER TO local_user;
