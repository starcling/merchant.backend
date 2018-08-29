-- FUNCTION: public.fc_create_payment_contract(integer, uuid, integer, bigint, bigint, bigint, text, text, text, integer, text);

-- DROP FUNCTION public.fc_create_payment_contract(integer, uuid, integer, bigint, bigint, bigint, text, text, text, integer, text);

CREATE OR REPLACE FUNCTION public.fc_create_payment_contract(
	_hdWalletIndex integer,
	_paymentID uuid,
    _numberOfPayments integer,
	_nextPaymentDate bigint,
	_lastPaymentDate bigint,
	_startTimestamp bigint,
	_customerAddress text,
    _merchantAddress text,
    _pullPaymentAddress text,
	_statusID integer,
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
        "lastPaymentDate", 
        "startTimestamp", 
        "customerAddress", 
        "merchantAddress", 
        "pullPaymentAddress", 
        "statusID", 
        "userID")
	VALUES (
        _hdWalletIndex, 
        _paymentID, 
        _numberOfPayments,
        _nextPaymentDate, 
        _lastPaymentDate, 
        _startTimestamp, 
        _customerAddress, 
        _merchantAddress, 
        _pullPaymentAddress, 
        _statusID, 
        _userID) 
    RETURNING * INTO tb_payment_contracts;
RETURN tb_payment_contracts;
END

$BODY$;

ALTER FUNCTION public.fc_create_payment_contract(integer, uuid, integer, bigint, bigint, bigint, text, text, text, integer, text)
    OWNER TO local_user;
