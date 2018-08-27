-- FUNCTION: public.fc_delete_payment_contract(uuid)

-- DROP FUNCTION public.fc_delete_payment_contract(uuid);

CREATE OR REPLACE FUNCTION public.fc_delete_payment_contract(
	_id uuid)
    RETURNS BOOLEAN
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


BEGIN
  DELETE FROM public.tb_payment_contracts WHERE id = _id;
  RETURN FOUND;
END;

$BODY$;

ALTER FUNCTION public.fc_delete_payment_contract(uuid)
    OWNER TO local_user;
