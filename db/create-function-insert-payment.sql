-- FUNCTION: public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer)

-- DROP FUNCTION public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer);

CREATE OR REPLACE FUNCTION public.fc_create_payment(
	_title text,
	_description text,
	_amount bigint,
	_currency text,
	_starts bigint,
	_endTimestamp bigint,
	_type integer,
	_frequency integer)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payments public.tb_payments;
BEGIN
INSERT INTO public.tb_payments(
	title, description, amount, currency, "startTimestamp", "endTimestamp", type, frequency)
	VALUES (_title, _description, _amount, _currency, _starts, _endTimestamp, _type, _frequency ) RETURNING * INTO tb_payments;
RETURN "tb_payments";
END

$BODY$;

ALTER FUNCTION public.fc_create_payment(text, text, bigint, text, bigint, bigint, integer, integer)
    OWNER TO local_user;