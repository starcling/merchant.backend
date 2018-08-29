-- FUNCTION: public.fc_delete_transaction(text)

-- DROP FUNCTION public.fc_delete_transaction(text);

CREATE OR REPLACE FUNCTION public.fc_delete_transaction(
	_hash text)
    RETURNS BOOLEAN
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


BEGIN
  DELETE FROM public.tb_blockchain_transactions WHERE hash = _hash;
  RETURN FOUND;
END;

$BODY$;

ALTER FUNCTION public.fc_delete_transaction(text)
    OWNER TO local_user;
