-- FUNCTION: public.fc_delete_payment_model(uuid)

-- DROP FUNCTION public.fc_delete_payment_model(uuid);

CREATE OR REPLACE FUNCTION public.fc_delete_payment_model(
	_id uuid)
    RETURNS BOOLEAN
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


BEGIN
  DELETE FROM public.tb_payment_models WHERE id = _id;
  RETURN FOUND;
END;

$BODY$;

ALTER FUNCTION public.fc_delete_payment_model(uuid)
    OWNER TO local_user;
