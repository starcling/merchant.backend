-- FUNCTION: public.fc_patch_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text)

-- DROP FUNCTION public.fc_patch_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text);

CREATE OR REPLACE FUNCTION public.fc_patch_payment(
	_id uuid,
	_title text,
	_description text,
	_promo text,
	_status integer,
	_customeraddress text,
	_amount bigint,
	_currency text,
	_startts bigint,
	_endts bigint,
	_type integer,
	_frequency integer,
	_transactionhash text,
	_debitaccount text)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payments public.tb_payments;
BEGIN
UPDATE public.tb_payments SET
	title = _title, description = _description, promo = _promo, status = _status,"customerAddress" = _customeraddress,amount = _amount, currency = _currency,
	"startTS" = _startts, "endTS" = _endts, type = _type, frequency = _frequency, "transactionHash" = _transactionhash, "debitAccount" = _debitaccount
    WHERE id = _id RETURNING * INTO tb_payments;
RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fc_patch_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text)
    OWNER TO local_user;
