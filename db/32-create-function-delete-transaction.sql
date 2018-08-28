-- FUNCTION: public.fc_delete_transaction(uuid)

-- DROP FUNCTION public.fc_delete_transaction(uuid);

CREATE OR REPLACE FUNCTION public.fc_delete_transaction(
	_id uuid)
    RETURNS BOOLEAN
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


BEGIN
  DELETE FROM public.tb_blockchain_transactions WHERE id = _id;
  RETURN FOUND;
END;

$BODY$;

ALTER FUNCTION public.fc_delete_transaction(uuid)
    OWNER TO local_user;
