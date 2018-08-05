-- FUNCTION: public.fc_update_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, bigint, bigint, integer, integer, text, integer, text, integer, text, text, text);

-- DROP FUNCTION public.fc_update_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, bigint, bigint, integer, integer, text, integer, text, integer, text, text, text);

CREATE OR REPLACE FUNCTION public.fc_update_payment(
	_id uuid,
	_title text,
	_description text,
	_promo text,
	_status integer,
	_customerAddress text,
	_amount bigint,
	_currency text,
	_startTimestamp bigint,
	_endTimestamp bigint,
	_limit integer,
	_nextPaymentDate bigint,
	_lastPaymentDate bigint,
	_type integer,
	_frequency integer,
	_registerTxHash text,
	_registerTxStatus integer,
	_executeTxHash text,
	_executeTxStatus integer,
	_pullPaymentAccountAddress text,
	_merchantAddress text,
	_userId text)
    RETURNS tb_payments
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE
tb_payments public.tb_payments;
tb_temp public.tb_payments;
BEGIN

SELECT * FROM public.tb_payments WHERE id=_id INTO tb_temp;

IF _title IS NULL OR _title = ''
THEN
	_title = tb_temp.title;
END IF;
IF _description IS NULL OR _description = ''
THEN
	_description = tb_temp.description;
END IF;
IF _promo IS NULL OR _promo = ''
THEN
	_promo = tb_temp.promo;
END IF;
IF _status IS NULL
THEN
	_status = tb_temp.status;
END IF;
IF _customerAddress IS NULL OR _customerAddress = ''
THEN
	_customerAddress = tb_temp."customerAddress";
END IF;
IF _amount IS NULL
THEN
	_amount = tb_temp.amount;
END IF;
IF _currency IS NULL OR _currency = ''
THEN
	_currency = tb_temp.currency;
END IF;
IF _startTimestamp IS NULL
THEN
	_startTimestamp = tb_temp."startTimestamp";
END IF;
IF _endTimestamp IS NULL
THEN
	_endTimestamp = tb_temp."endTimestamp";
END IF;
IF _limit IS NULL
THEN
	_limit = tb_temp."limit";
END IF;
IF _nextPaymentDate IS NULL
THEN
	_nextPaymentDate = tb_temp."nextPaymentDate";
END IF;
IF _lastPaymentDate IS NULL
THEN
	_lastPaymentDate = tb_temp."lastPaymentDate";
END IF;
IF _type IS NULL
THEN
	_type = tb_temp.type;
END IF;
IF _frequency IS NULL
THEN
	_frequency = tb_temp.frequency;
END IF;
IF _registerTxHash IS NULL OR _registerTxHash = ''
THEN
	_registerTxHash = tb_temp."registerTxHash";
END IF;
IF _registerTxStatus IS NULL
THEN
	_registerTxStatus = tb_temp."registerTxStatus";
END IF;
IF _executeTxHash IS NULL OR _executeTxHash = ''
THEN
	_executeTxHash = tb_temp."executeTxHash";
END IF;
IF _executeTxStatus IS NULL
THEN
	_executeTxStatus = tb_temp."executeTxStatus";
END IF;
IF _pullPaymentAccountAddress IS NULL OR _pullPaymentAccountAddress = ''
THEN
	_pullPaymentAccountAddress = tb_temp."pullPaymentAccountAddress";
END IF;
IF _merchantAddress IS NULL OR _merchantAddress = ''
THEN
	_merchantAddress = tb_temp."merchantAddress";
END IF;
IF _userId IS NULL OR _userId = ''
THEN
	_userId = tb_temp."userId";
END IF;

UPDATE public.tb_payments SET
	title = _title, description = _description, promo = _promo, status = _status, "customerAddress" = _customerAddress, amount = _amount, currency = _currency,
	"startTimestamp" = _startTimestamp, "endTimestamp" = _endTimestamp, "limit" = _limit, "nextPaymentDate" = _nextPaymentDate, "lastPaymentDate" = _lastPaymentDate,
	type = _type, frequency = _frequency, "registerTxHash" = _registerTxHash, "registerTxStatus" = _registerTxStatus, "executeTxHash" = _executeTxHash,
	"executeTxStatus" = _executeTxStatus, "pullPaymentAccountAddress" = _pullPaymentAccountAddress, "merchantAddress" = _merchantAddress, "userId" = _userId
    WHERE id = _id RETURNING * INTO tb_payments;

	RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fc_update_payment(uuid, text, text, text, integer, text, bigint, text, bigint, bigint, integer, bigint, bigint, integer, integer, text, integer, text, integer, text, text, text)
    OWNER TO local_user;
