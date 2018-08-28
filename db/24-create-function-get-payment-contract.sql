-- FUNCTION: public.fc_get_payment_contract(uuid)

-- DROP FUNCTION public.fc_get_payment_contract(uuid);

CREATE OR REPLACE FUNCTION public.fc_get_payment_contract(
	_id uuid)
    RETURNS TABLE (
        id uuid,
        title character varying (255),
        description character varying (255),
        promo character varying (255),
        amount bigint,
        "initialPaymentAmount" bigint,
        currency character varying (255),
        "numberOfPayments" integer,
        frequency integer,
        type character varying (255),
        status character varying (255),
        "networkID" integer,
        "nextPaymentDate" bigint,
        "lastPaymentDate" bigint,
        "startTimestamp" bigint,
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
        public.tb_payment_contracts.id as id,
        public.tb_payments.title as title,
        public.tb_payments.description as description,
        public.tb_payments.promo as promo,
        public.tb_payments.amount as amount,
        public.tb_payments."initialPaymentAmount" as initialPaymentAmount,
        public.tb_payments.currency as currency,
        public.tb_payment_contracts."numberOfPayments" as numberOfPayments,
        public.tb_payments.frequency as frequency,
        public.tb_payment_type.name as type,
        public.tb_contract_status.name as status,
        public.tb_payments."networkID" as networkID,
        public.tb_payment_contracts."nextPaymentDate" as nextPaymentDate,
        public.tb_payment_contracts."lastPaymentDate" as lastPaymentDate,
        public.tb_payment_contracts."startTimestamp" as startTimestamp,
        public.tb_payment_contracts."pullPaymentAddress" as pullPaymentAddress,
        public.tb_payment_contracts."userID" as userID
    FROM (public.tb_payment_contracts 
    JOIN public.tb_payments ON public.tb_payment_contracts."paymentID" = public.tb_payments.id
    JOIN public.tb_payment_type ON public.tb_payments."typeID" = public.tb_payment_type.id
    JOIN public.tb_contract_status ON public.tb_payment_contracts."statusID" = public.tb_contract_status.id)
    WHERE public.tb_payment_contracts.id = _id
    LIMIT 1);

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: contract_with_provided_id_not_found.';
    END IF;
END

$BODY$;

ALTER FUNCTION public.fc_get_payment_contract(uuid)
    OWNER TO local_user;
