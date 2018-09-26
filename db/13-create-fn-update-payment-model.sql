-- FUNCTION: public.fc_update_payment_model(uuid, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer);

-- DROP FUNCTION public.fc_update_payment_model(uuid, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer);

CREATE OR REPLACE FUNCTION public.fc_update_payment_model(
	_id uuid,
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
	_automatedCashOut boolean,
	_cashOutFrequency integer)
    RETURNS tb_payment_models
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE
tb_payment_models public.tb_payment_models;
tb_temp public.tb_payment_models;
BEGIN

SELECT * FROM public.tb_payment_models WHERE id=_id INTO tb_temp;

IF _title IS NULL OR _title = ''
THEN
	_title = tb_temp.title;
END IF;
IF _description IS NULL OR _description = ''
THEN
	_description = tb_temp.description;
END IF;
IF _amount IS NULL
THEN
	_amount = tb_temp.amount;
END IF;
IF _initialPaymentAmount IS NULL
THEN
	_initialPaymentAmount = tb_temp."initialPaymentAmount";
END IF;
IF _trialPeriod IS NULL
THEN
	_trialPeriod = tb_temp."trialPeriod";
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
IF _automatedCashOut IS NULL
THEN
	_automatedCashOut = tb_temp."automatedCashOut";
END IF;
IF _cashOutFrequency IS NULL
THEN
	_cashOutFrequency = tb_temp."cashOutFrequency";
END IF;

UPDATE public.tb_payment_models SET
	title = _title, 
    description = _description, 
    amount = _amount,
	"initialPaymentAmount" = _initialPaymentAmount, 
	"trialPeriod" = _trialPeriod, 
    currency = _currency, 
	"numberOfPayments" = _numberOfPayments, 
	frequency = _frequency, 
	"typeID" = _typeID,
    "networkID" = _networkID,
	"automatedCashOut" = _automatedCashOut,
	"cashOutFrequency" = _cashOutFrequency
    WHERE id = _id RETURNING * INTO tb_payment_models;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: payment_with_provided_id_not_found.';
    END IF;

	RETURN tb_payment_models;
END

$BODY$;

ALTER FUNCTION public.fc_update_payment_model(uuid, text, text, bigint, bigint, bigint, text, integer, integer, integer, integer, boolean, integer)
    OWNER TO local_user;
