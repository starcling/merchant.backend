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
tb_test public.tb_payments;
BEGIN

SELECT * FROM public.tb_payments INTO tb_test;

IF _title IS NULL OR _title = ''
THEN
	_title = tb_test.title;
END IF;
IF _description IS NULL OR _description = ''
THEN
	_description = tb_test.description;
END IF;
IF _promo IS NULL OR _promo = ''
THEN
	_promo = tb_test.promo;
END IF;
IF _status IS NULL 
THEN
	_status = tb_test.status;
END IF;
IF _customeraddress IS NULL OR _customeraddress = ''
THEN
	_customeraddress = tb_test."customerAddress";
END IF;
IF _amount IS NULL 
THEN
	_amount = tb_test.amount;
END IF;
IF _currency IS NULL OR _currency = ''
THEN
	_currency = tb_test.currency;
END IF;
IF _startts IS NULL
THEN
	_startts = tb_test."startTS";
END IF;
IF _endts IS NULL
THEN
	_endts = tb_test."endTS";
END IF;
IF _frequency IS NULL
THEN
	_frequency = tb_test.frequency;
END IF;
IF _transactionhash IS NULL OR _transactionhash = ''
THEN
	_transactionhash = tb_test."transactionHash";
END IF;
IF _debitaccount IS NULL OR _debitaccount = ''
THEN
	_debitaccount = tb_test."debitAccount";
END IF;

UPDATE public.tb_payments SET
	title = _title, description = _description, promo = _promo, status = _status,"customerAddress" = _customeraddress,amount = _amount, currency = _currency,
	"startTS" = _startts, "endTS" = _endts, type = _type, frequency = _frequency, "transactionHash" = _transactionhash, "debitAccount" = _debitaccount
    WHERE id = _id RETURNING * INTO tb_payments;
RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fc_patch_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text)
    OWNER TO local_user;
