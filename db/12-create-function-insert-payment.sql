-- FUNCTION: public.fc_create_payment(uuid, text, text, text, bigint, bigint, text, integer, integer, integer, integer);

-- DROP FUNCTION public.fc_create_payment(uuid, text, text, text, bigint, bigint, text, integer, integer, integer, integer);

CREATE OR REPLACE FUNCTION public.fc_create_payment(
    _merchantID uuid,
	_title text,
	_description text,
    _promo text,
	_amount bigint,
	_initialPaymentAmount bigint,
	_currency text,
	_numberOfPayments integer,
    _frequency integer,
	_typeID integer,
	_networkID integer)
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
        currency, 
        "numberOfPayments", 
        frequency, 
        "typeID", 
        "networkID")
	VALUES (
        _merchantID,
        _title, 
        _description, 
        _promo,
        _amount, 
        _initialPaymentAmount, 
        _currency, 
        _numberOfPayments, 
        _frequency, 
        _typeID, 
        _networkID) 
    RETURNING * INTO tb_payments;
RETURN "tb_payments";
END

$BODY$;

ALTER FUNCTION public.fc_create_payment(uuid, text, text, text, bigint, bigint, text, integer, integer, integer, integer)
    OWNER TO local_user;
