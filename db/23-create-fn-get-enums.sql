-- FUNCTION: public.fc_get_enums(uuid)

-- DROP FUNCTION public.fc_get_enums(uuid);

CREATE OR REPLACE FUNCTION public.fc_get_enums(
	_table text)
    RETURNS TABLE (
        id integer,
        name character varying (255)
    )
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN

    IF _table = 'tb_payment_status' THEN
        RETURN QUERY
        SELECT * FROM public.tb_payment_status;
    ELSIF _table = 'tb_payment_model_type' THEN
        RETURN QUERY
        SELECT * FROM public.tb_payment_model_type;
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

ALTER FUNCTION public.fc_get_enums(text)
    OWNER TO local_user;
