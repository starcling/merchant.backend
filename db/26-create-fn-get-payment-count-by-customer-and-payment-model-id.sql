-- FUNCTION: public.fn_get_payment_count_by_customer_and_payment_model_id(text, uuid)

-- DROP FUNCTION public.fn_get_payment_count_by_customer_and_payment_model_id(text, uuid);

CREATE OR REPLACE FUNCTION public.fn_get_payment_count_by_customer_and_payment_model_id(
    _customerAddress text,
	_pullPaymentModelID uuid)
    RETURNS int
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE _count int;

BEGIN
    SELECT COUNT(*)::int
    FROM public.tb_payments
    WHERE public.tb_payments."pullPaymentModelID" = _pullPaymentModelID
    AND public.tb_payments."customerAddress" = _customerAddress
    INTO _count;

    RETURN _count;
END

$BODY$;

ALTER FUNCTION public.fn_get_payment_count_by_customer_and_payment_model_id(text, uuid)
    OWNER TO local_user;

