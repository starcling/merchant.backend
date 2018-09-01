-- FUNCTION: public.fc_get_contract_by_customer_and_payment_id(text, uuid)

-- DROP FUNCTION public.fc_get_contract_by_customer_and_payment_id(text, uuid);

CREATE OR REPLACE FUNCTION public.fc_get_contract_by_customer_and_payment_id(
    _customerAddress text,
	_paymentID uuid)
    RETURNS tb_payment_contracts
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE tb_payment_contracts public.tb_payment_contracts;

BEGIN
    SELECT *
    FROM public.tb_payment_contracts 
    WHERE public.tb_payment_contracts."customerAddress" = _customerAddress 
    AND public.tb_payment_contracts."paymentID" = _paymentID 
    INTO tb_payment_contracts;

    RETURN tb_payment_contracts;
END

$BODY$;

ALTER FUNCTION public.fc_get_contract_by_customer_and_payment_id(text, uuid)
    OWNER TO local_user;

