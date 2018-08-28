-- FUNCTION: public.fc_get_status_types(uuid)

-- DROP FUNCTION public.fc_get_status_types(uuid);

CREATE OR REPLACE FUNCTION public.fc_get_status_types(
	_table text)
    RETURNS TABLE (
        _id integer,
        _name character varying (255)
    )
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN

    IF _table = 'tb_contract_status' THEN
        RETURN QUERY
        SELECT * FROM public.tb_contract_status;
    ELSIF _table = 'tb_payment_type' THEN
        RETURN QUERY
        SELECT * FROM public.tb_payment_type;
    ELSIF _table = 'tb_transaction_status' THEN
        RETURN QUERY
        SELECT * FROM public.tb_transaction_status;
    ELSIF _table = 'tb_transaction_type' THEN
        RETURN QUERY
        SELECT * FROM public.tb_transaction_type;
    END IF;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'SQL Query failed. Reason: invalid_table_name.';
    END IF;

END

$BODY$;

ALTER FUNCTION public.fc_get_status_types(text)
    OWNER TO local_user;
