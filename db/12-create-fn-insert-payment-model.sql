-- FUNCTION: public.fc_create_payment_model(uuid, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer);

-- DROP FUNCTION public.fc_create_payment_model(uuid, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer);

CREATE OR REPLACE FUNCTION public.fc_create_payment_model(
    _merchantID uuid,
	_title text,
	_description text,
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
    RETURNS tb_payment_models
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payment_models public.tb_payment_models;
BEGIN
INSERT INTO public.tb_payment_models(
        "merchantID",
        title, 
        description, 
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
    RETURNING * INTO tb_payment_models;
RETURN "tb_payment_models";
END

$BODY$;

ALTER FUNCTION public.fc_create_payment_model(uuid, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer)
    OWNER TO local_user;
