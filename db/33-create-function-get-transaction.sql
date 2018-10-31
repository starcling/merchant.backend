-- FUNCTION: public.fc_get_transaction(text)

-- DROP FUNCTION public.fc_get_transaction(text);

CREATE OR REPLACE FUNCTION public.fc_get_transaction(
	_hash text)
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
    WHERE public.tb_blockchain_transactions.hash = _hash
    LIMIT 1);

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: transaction_with_provided_hash_not_found.';
    END IF;
END

$BODY$;

ALTER FUNCTION public.fc_get_transaction(text)
    OWNER TO local_user;
