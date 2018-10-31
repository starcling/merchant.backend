-- FUNCTION: public.fc_get_all_payment_models()

-- DROP FUNCTION public.fc_get_all_payment_models();

CREATE OR REPLACE FUNCTION public.fc_get_all_payment_models()
    RETURNS SETOF tb_payment_models
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

DECLARE 
	tb_payment_models public.tb_payment_models;
BEGIN
	RETURN QUERY
	SELECT * FROM public.tb_payment_models;

END

$BODY$;

ALTER FUNCTION public.fc_get_all_payment_models()
    OWNER TO local_user;