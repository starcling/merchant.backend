-- FUNCTION: public.fc_get_all_payment_details()

-- DROP FUNCTION public.fc_get_all_payment_details();

CREATE OR REPLACE FUNCTION public.fc_get_all_payment_details()
    RETURNS SETOF tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

DECLARE 
	tb_payments public.tb_payments;
BEGIN
	RETURN QUERY
	SELECT * FROM public.tb_payments;

END

$BODY$;

ALTER FUNCTION public.fc_get_all_payment_details()
    OWNER TO local_user;