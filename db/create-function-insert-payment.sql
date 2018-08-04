-- FUNCTION: public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer)

-- DROP FUNCTION public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer);

CREATE OR REPLACE FUNCTION public.fc_create_payment(
	_title text,
	_description text,
	_amount bigint,
	_currency text,
	_starts bigint,
	_endTimestamp bigint,
	_limit integer,
	_nextPaymentDate bigint,
	_type integer,
	_frequency integer,
	_merchantAddress text)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payments public.tb_payments;
BEGIN
INSERT INTO public.tb_payments(
	title, description, amount, currency, "startTimestamp", "endTimestamp", "limit", "nextPaymentDate", type, frequency, "merchantAddress")
	VALUES (_title, _description, _amount, _currency, _starts, _endTimestamp, _limit, _nextPaymentDate, _type, _frequency, _merchantAddress) RETURNING * INTO tb_payments;
RETURN "tb_payments";
END

$BODY$;

ALTER FUNCTION public.fc_create_payment(text, text, bigint, text, bigint, bigint, integer, bigint, integer, integer, text)
    OWNER TO local_user;
