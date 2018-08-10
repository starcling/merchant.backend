-- FUNCTION: public.fc_get_all_payment_details(integer)

-- DROP FUNCTION public.fc_get_all_payment_details(integer);

CREATE OR REPLACE FUNCTION public.fc_get_all_payment_details(
    _networkID integer
	)
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
	SELECT * FROM public.tb_payments WHERE "networkID" = _networkID;

END

$BODY$;

ALTER FUNCTION public.fc_get_all_payment_details(integer)
    OWNER TO local_user;
