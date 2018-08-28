-- FUNCTION: public.fc_update_payment(uuid, text, text, text, bigint, bigint, text, integer, integer, integer, integer);

-- DROP FUNCTION public.fc_update_payment(uuid, text, text, text, bigint, bigint, text, integer, integer, integer, integer);

CREATE OR REPLACE FUNCTION public.fc_update_payment(
	_id uuid,
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
IF _amount IS NULL
THEN
	_amount = tb_temp.amount;
END IF;
IF _initialPaymentAmount IS NULL
THEN
	_initialPaymentAmount = tb_temp."initialPaymentAmount";
END IF;
IF _currency IS NULL OR _currency = ''
THEN
	_currency = tb_temp.currency;
END IF;
IF _numberOfPayments IS NULL
THEN
	_numberOfPayments = tb_temp."numberOfPayments";
END IF;
IF _frequency IS NULL
THEN
	_frequency = tb_temp.frequency;
END IF;
IF _typeID IS NULL
THEN
	_typeID = tb_temp."typeID";
END IF;
IF _networkID IS NULL
THEN
	_networkID = tb_temp."networkID";
END IF;

UPDATE public.tb_payments SET
	title = _title, 
    description = _description, 
    promo = _promo, 
    amount = _amount, 
	"initialPaymentAmount" = _initialPaymentAmount, 
    currency = _currency, 
	"numberOfPayments" = _numberOfPayments, 
	frequency = _frequency, 
	"typeID" = _typeID,
    "networkID" = _networkID
    WHERE id = _id RETURNING * INTO tb_payments;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: payment_with_provided_id_not_found.';
    END IF;

	RETURN tb_payments;
END

$BODY$;

ALTER FUNCTION public.fc_update_payment(uuid, text, text, text, bigint, bigint, text, integer, integer, integer, integer)
    OWNER TO local_user;
