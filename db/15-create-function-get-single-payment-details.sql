-- -- FUNCTION: public.fc_get_payment_details(uuid)

-- -- DROP FUNCTION public.fc_get_payment_details(uuid);

-- CREATE OR REPLACE FUNCTION public.fc_get_payment_details(
-- 	_id uuid)
--     RETURNS tb_payments
--     LANGUAGE 'plpgsql'

--     COST 100
--     VOLATILE 
-- AS $BODY$

-- DECLARE
-- 	tb_payments public.tb_payments;
-- BEGIN
-- 	SELECT * FROM public.tb_payments WHERE id = _id INTO tb_payments;

--     RETURN tb_payments;
-- END

-- $BODY$;

-- ALTER FUNCTION public.fc_get_payment_details(uuid)
--     OWNER TO local_user;
