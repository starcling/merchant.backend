-- FUNCTION: public.fc_create_payment(uuid, text, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer);

-- DROP FUNCTION public.fc_create_payment(uuid, text, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer);

CREATE OR REPLACE FUNCTION public.fc_create_payment(
    _merchantID uuid,
	_title text,
	_description text,
    _promo text,
	_amount bigint,
	_initialPaymentAmount bigint,
    _trialPeriod bigint,
	_currency text,
	_numberOfPayments integer,
    _frequency integer,
	_typeID integer,
	_networkID integer,
    _automatedCashOut boolean default false,
    _cashOutFrequency integer default 1)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payments public.tb_payments;
BEGIN
INSERT INTO public.tb_payments(
        "merchantID",
        title, 
        description, 
        promo,
        amount, 
        "initialPaymentAmount", 
        "trialPeriod",
        currency, 
        "numberOfPayments", 
        frequency, 
        "typeID", 
        "networkID",
        "automatedCashOut",
        "cashOutFrequency")
	VALUES (
        _merchantID,
        _title, 
        _description, 
        _promo,
        _amount, 
        _initialPaymentAmount,
        _trialPeriod,
        _currency, 
        _numberOfPayments, 
        _frequency, 
        _typeID, 
        _networkID,
        _automatedCashOut,
        _cashOutFrequency) 
    RETURNING * INTO tb_payments;
RETURN "tb_payments";
END

$BODY$;

ALTER FUNCTION public.fc_create_payment(uuid, text, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer)
    OWNER TO local_user;
