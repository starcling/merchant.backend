CREATE OR REPLACE FUNCTION public.fc_get_merchantaddress()
    RETURNS TABLE(merchantAddress varchar)
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

DECLARE 
	tb_payments public.tb_payments;
BEGIN
	RETURN QUERY
	 select distinct "merchantAddress" from tb_payments;


END

$BODY$;

ALTER FUNCTION public.fc_get_merchantaddress()
    OWNER TO local_user;
