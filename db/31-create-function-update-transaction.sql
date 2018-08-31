-- FUNCTION: public.fc_update_transaction(text, integer);

-- DROP FUNCTION public.fc_update_transaction(text, integer);

CREATE OR REPLACE FUNCTION public.fc_update_transaction(
	_hash text,
	_statusID integer)
    RETURNS tb_blockchain_transactions
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE
tb_blockchain_transactions public.tb_blockchain_transactions;
BEGIN

	UPDATE public.tb_blockchain_transactions SET "statusID" = _statusID
    WHERE hash = _hash RETURNING * INTO tb_blockchain_transactions;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: transaction_with_provided_hash_not_found.';
    END IF;

	RETURN tb_blockchain_transactions;

	
END

$BODY$;

ALTER FUNCTION public.fc_update_transaction(text, integer)
    OWNER TO local_user;
