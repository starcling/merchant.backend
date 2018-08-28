-- FUNCTION: public.fc_update_payment_contract(uuid, integer, integer, bigint, bigint, bigint, integer, text);

-- DROP FUNCTION public.fc_update_payment_contract(uuid, integer, integer, bigint, bigint, bigint, integer, text);

CREATE OR REPLACE FUNCTION public.fc_update_payment_contract(
	_id uuid,
	_hdWalletIndex integer,
    _numberOfPayments integer,
	_nextPaymentDate bigint,
	_lastPaymentDate bigint,
	_startTimestamp bigint,
	_statusID integer,
	_userID text)
    RETURNS tb_payment_contracts
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE
tb_payment_contracts public.tb_payment_contracts;
tb_temp public.tb_payment_contracts;
BEGIN

SELECT * FROM public.tb_payment_contracts WHERE id=_id INTO tb_temp;

IF _hdWalletIndex IS NULL
THEN
	_hdWalletIndex = tb_temp."hdWalletIndex";
END IF;
IF _numberOfPayments IS NULL
THEN
	_numberOfPayments = tb_temp."numberOfPayments";
END IF;
IF _nextPaymentDate IS NULL
THEN
	_nextPaymentDate = tb_temp."nextPaymentDate";
END IF;
IF _lastPaymentDate IS NULL
THEN
	_lastPaymentDate = tb_temp."lastPaymentDate";
END IF;
IF _startTimestamp IS NULL
THEN
	_startTimestamp = tb_temp."startTimestamp";
END IF;
IF _statusID IS NULL
THEN
	_statusID = tb_temp."statusID";
END IF;
IF _userID IS NULL OR _userID = ''
THEN
	_userID = tb_temp."userID";
END IF;

UPDATE public.tb_payment_contracts SET
	"hdWalletIndex" = _hdWalletIndex, 
    "numberOfPayments" = _numberOfPayments, 
    "nextPaymentDate" = _nextPaymentDate, 
    "lastPaymentDate" = _lastPaymentDate, 
	"startTimestamp" = _startTimestamp, 
    "statusID" = _statusID,
	"userID" = _userID
    WHERE id = _id RETURNING * INTO tb_payment_contracts;

	IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: contract_with_provided_id_not_found.';
    END IF;

	RETURN tb_payment_contracts;
END

$BODY$;

ALTER FUNCTION public.fc_update_payment_contract(uuid, integer, integer, bigint, bigint, bigint, integer, text)
    OWNER TO local_user;
