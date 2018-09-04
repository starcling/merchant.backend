-- FUNCTION: public.fc_create_payment_contract(integer, uuid, integer, bigint, bigint, text, text, text, text);

-- DROP FUNCTION public.fc_create_payment_contract(integer, uuid, integer, bigint, bigint, text, text, text, text);

CREATE OR REPLACE FUNCTION public.fc_create_payment_contract(
	_hdWalletIndex integer,
	_paymentID uuid,
    _numberOfPayments integer,
	_nextPaymentDate bigint,
	_startTimestamp bigint,
	_customerAddress text,
    _merchantAddress text,
    _pullPaymentAddress text,
	_userID text)
    RETURNS tb_payment_contracts
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payment_contracts public.tb_payment_contracts;
BEGIN
INSERT INTO public.tb_payment_contracts(
        "hdWalletIndex", 
        "paymentID", 
        "numberOfPayments",
        "nextPaymentDate", 
        "startTimestamp", 
        "customerAddress", 
        "merchantAddress", 
        "pullPaymentAddress",
        "userID")
	VALUES (
        _hdWalletIndex, 
        _paymentID, 
        _numberOfPayments,
        _nextPaymentDate, 
        _startTimestamp, 
        _customerAddress, 
        _merchantAddress, 
        _pullPaymentAddress, 
        _userID) 
    RETURNING * INTO tb_payment_contracts;
RETURN tb_payment_contracts;
END

$BODY$;

ALTER FUNCTION public.fc_create_payment_contract(integer, uuid, integer, bigint, bigint, text, text, text, text)
    OWNER TO local_user;
