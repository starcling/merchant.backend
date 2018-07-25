-- FUNCTION: public.fc_update_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text)

-- DROP FUNCTION public.fc_update_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text);

CREATE OR REPLACE FUNCTION public.fc_update_payment(
	_id uuid,
	_title text,
	_description text,
	_promo text,
	_status integer,
	_customeraddress text,
	_amount bigint,
	_currency text,
	_startTimestamp bigint,
	_endTimestamp bigint,
	_type integer,
	_frequency integer,
	_registerTxHash text,
	_executeTxHash text,
	_executeTxStatus integer,
	_debitaccount text,
	_merchantAddress text)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_payments public.tb_payments;
tb_test public.tb_payments;
BEGIN

SELECT * FROM public.tb_payments WHERE id=_id INTO tb_test;

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
IF _startTimestamp IS NULL
THEN
	_startTimestamp = tb_test."startTimestamp";
END IF;
IF _endTimestamp IS NULL
THEN
	_endTimestamp = tb_test."endTimestamp";
END IF;
IF _type IS NULL 
THEN
	_type = tb_test.type;
END IF;
IF _frequency IS NULL
THEN
	_frequency = tb_test.frequency;
END IF;
IF _registerTxHash IS NULL OR _registerTxHash = ''
THEN
	_registerTxHash = tb_test."registerTxHash";
END IF;
IF _executeTxHash IS NULL OR _executeTxHash = ''
THEN
	_executeTxHash = tb_test."executeTxHash";
END IF;
IF _executeTxStatus IS NULL 
THEN
	_executeTxStatus = tb_test."executeTxStatus";
END IF;
IF _debitaccount IS NULL OR _debitaccount = ''
THEN
	_debitaccount = tb_test."debitAccount";
END IF;
IF _merchantAddress IS NULL OR _merchantAddress = ''
THEN
	_merchantAddress = tb_test."merchantAddress";
END IF;

UPDATE public.tb_payments SET
	title = _title, description = _description, promo = _promo, status = _status, "customerAddress" = _customeraddress, amount = _amount, currency = _currency,
	"startTimestamp" = _startTimestamp, "endTimestamp" = _endTimestamp, type = _type, frequency = _frequency, "registerTxHash" = _registerTxHash, "executeTxHash" = _executeTxHash, 
	"executeTxStatus" = _executeTxStatus, "debitAccount" = _debitaccount, "merchantAddress" = _merchantAddress
    WHERE id = _id RETURNING * INTO tb_payments;

	RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fc_update_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, integer, text, text, integer, text, text)
    OWNER TO local_user;
