-- FUNCTION: public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer)

-- DROP FUNCTION public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer);

CREATE OR REPLACE FUNCTION public.fc_create_payment(
	_title text,
	_description text,
	_status integer,
	_amount bigint,
	_currency text,
	_starts bigint,
	_endts bigint,
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
	title, description, status, amount, currency, "startTS", "endTS", type, frequency)
	VALUES (_title, _description, _status, _amount, _currency, _starts, _endts, _type, _frequency ) RETURNING * INTO tb_payments;
RETURN "tb_payments";
END

$BODY$;

ALTER FUNCTION public.fc_create_payment(text, text, integer, bigint, text, bigint, bigint, integer, integer)
    OWNER TO local_user;
