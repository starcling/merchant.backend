-- FUNCTION: public.fc_create_payment(integer, uuid, integer, bigint, bigint, text, text, text, text);

-- DROP FUNCTION public.fc_create_payment(integer, uuid, integer, bigint, bigint, text, text, text, text);

CREATE OR REPLACE FUNCTION public.fc_create_payment(
	_hdWalletIndex integer,
	_pullPaymentModelID uuid,
    _numberOfPayments integer,
	_nextPaymentDate bigint,
	_startTimestamp bigint,
	_customerAddress text,
    _merchantAddress text,
    _pullPaymentAddress text,
	_userID text)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payments public.tb_payments;
BEGIN
INSERT INTO public.tb_payments(
        "hdWalletIndex", 
        "pullPaymentModelID",
        "numberOfPayments",
        "nextPaymentDate", 
        "startTimestamp", 
        "customerAddress", 
        "merchantAddress", 
        "pullPaymentAddress",
        "userID")
	VALUES (
        _hdWalletIndex, 
        _pullPaymentModelID,
        _numberOfPayments,
        _nextPaymentDate, 
        _startTimestamp, 
        _customerAddress, 
        _merchantAddress, 
        _pullPaymentAddress, 
        _userID) 
    RETURNING * INTO tb_payments;
RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fc_create_payment(integer, uuid, integer, bigint, bigint, text, text, text, text)
    OWNER TO local_user;
