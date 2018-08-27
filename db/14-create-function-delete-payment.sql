-- FUNCTION: public.fc_delete_payment(uuid)

-- DROP FUNCTION public.fc_delete_payment(uuid);

CREATE OR REPLACE FUNCTION public.fc_delete_payment(
	_id uuid)
    RETURNS BOOLEAN
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


BEGIN
  DELETE FROM public.tb_payments WHERE id = _id;
  RETURN FOUND;
END;

$BODY$;

ALTER FUNCTION public.fc_delete_payment(uuid)
    OWNER TO local_user;
