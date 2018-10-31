-- FUNCTION: public.fc_get_payment_model_by_id(uuid)

-- DROP FUNCTION public.fc_get_payment_model_by_id(uuid);

CREATE OR REPLACE FUNCTION public.fc_get_payment_model_by_id(
	_id uuid)
    RETURNS tb_payment_models
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE
	tb_payment_models public.tb_payment_models;
BEGIN
	SELECT * FROM public.tb_payment_models WHERE id = _id INTO tb_payment_models;

    RETURN tb_payment_models;
END

$BODY$;

ALTER FUNCTION public.fc_get_payment_model_by_id(uuid)
    OWNER TO local_user;
