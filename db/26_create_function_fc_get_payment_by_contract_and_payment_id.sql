-- FUNCTION: public.fc_get_contract_count_by_customer_and_payment_id(text, uuid)

-- DROP FUNCTION public.fc_get_contract_count_by_customer_and_payment_id(text, uuid);

CREATE OR REPLACE FUNCTION public.fc_get_contract_count_by_customer_and_payment_id(
    _customerAddress text,
	_paymentID uuid)
    RETURNS int
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE _count int;

BEGIN
    SELECT COUNT(*)::int
    FROM public.tb_payment_contracts 
    WHERE public.tb_payment_contracts."paymentID" = _paymentID 
    AND public.tb_payment_contracts."customerAddress" = _customerAddress
    INTO _count;

    RETURN _count;
END

$BODY$;

ALTER FUNCTION public.fc_get_contract_count_by_customer_and_payment_id(text, uuid)
    OWNER TO local_user;

