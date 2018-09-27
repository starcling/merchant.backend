-- FUNCTION: public.fn_get_payment_by_customer_and_payment_model_id(text, uuid)

-- DROP FUNCTION public.fn_get_payment_by_customer_and_payment_model_id(text, uuid);

CREATE OR REPLACE FUNCTION public.fn_get_payment_by_customer_and_payment_model_id(
    _customerAddress text,
	_pullPaymentModelID uuid)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE tb_payments public.tb_payments;

BEGIN
    SELECT *
    FROM public.tb_payments
    WHERE public.tb_payments."customerAddress" = _customerAddress
    AND public.tb_payments."pullPaymentModelID" = _pullPaymentModelID
    INTO tb_payments;

    RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fn_get_payment_by_customer_and_payment_model_id(text, uuid)
    OWNER TO local_user;

