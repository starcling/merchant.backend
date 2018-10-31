-- FUNCTION: public.fc_get_transactions_by_payment_id(uuid, integer, integer)

-- DROP FUNCTION public.fc_get_transactions_by_payment_id(uuid, integer, integer);

CREATE OR REPLACE FUNCTION public.fc_get_transactions_by_payment_id(
	_paymentID uuid,
    _statusID integer,
    _typeID integer)
    RETURNS TABLE (
        id uuid,
        hash character varying (255),
        status character varying (255),
        type character varying (255),
        "paymentID" uuid,
        "timestamp" bigint
    )
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN

IF _statusID IS NULL
THEN
	_statusID = 0;
END IF;
IF _typeID IS NULL
THEN
	_typeID = 0;
END IF;

    RETURN 
    QUERY (SELECT 
        public.tb_blockchain_transactions.id as id,
        public.tb_blockchain_transactions.hash as hash,
        public.tb_transaction_status.name as status,
        public.tb_transaction_type.name as type,
        public.tb_blockchain_transactions."paymentID" as "paymentID",
        public.tb_blockchain_transactions."timestamp" as "timestamp"
    FROM (public.tb_blockchain_transactions 
    JOIN public.tb_transaction_status ON public.tb_blockchain_transactions."statusID" = public.tb_transaction_status.id
    JOIN public.tb_transaction_type ON public.tb_blockchain_transactions."typeID" = public.tb_transaction_type.id)
    WHERE public.tb_blockchain_transactions."paymentID" = _paymentID
    AND ( CASE WHEN _statusID > 0 THEN public.tb_blockchain_transactions."statusID" ELSE _statusID END) = _statusID
    AND ( CASE WHEN _typeID > 0 THEN public.tb_blockchain_transactions."typeID" ELSE _typeID END) = _typeID);

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: transaction_with_provided_parameters_not_found.';
    END IF;
END

$BODY$;

ALTER FUNCTION public.fc_get_transactions_by_payment_id(uuid, integer, integer)
    OWNER TO local_user;
